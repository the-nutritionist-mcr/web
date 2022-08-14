// Everything in this folder is vendored in from https://github.com/serverless-nextjs/serverless-next.js/blob/master/packages/serverless-components/nextjs-cdk-construct
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import {
  OriginRequestImageHandlerManifest,
  OriginRequestApiHandlerManifest,
  OriginRequestDefaultHandlerManifest,
  RoutesManifest,
} from '@sls-next/lambda-at-edge';
import { PreRenderedManifest } from '@sls-next/core';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
  Role,
  ManagedPolicy,
  ServicePrincipal,
  CompositePrincipal,
  PolicyStatement,
} from 'aws-cdk-lib/aws-iam';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { OriginRequestQueryStringBehavior } from 'aws-cdk-lib/aws-cloudfront';
import { Props } from './props';
import { toLambdaOption } from './utils/toLambdaOptions';
import { readAssetsDirectory } from './utils/readAssetsDirectory';
import { readInvalidationPathsFromManifest } from './utils/readInvalidationPathsFromManifest';
import { reduceInvalidationPaths } from './utils/reduce-invalidation-paths';
import pathToPosix from './utils/pathToPosix';
import { Construct } from 'constructs';

export * from './props';

const addPermsToFunction = (
  scope: Construct,
  func: cloudfront.experimental.EdgeFunction | undefined,
  statements: PolicyStatement[],
  name: string
) => {
  if (!func) {
    return;
  }

  func.lambda.role.grantAssumeRole(
    new CompositePrincipal(
      new ServicePrincipal('lambda.amazonaws.com'),
      new ServicePrincipal('edgelambda.amazonaws.com')
    )
  );

  if (statements.length > 0) {
    statements.forEach((statement) =>
      func.lambda.role.addToPrincipalPolicy(statement)
    );
  }
};

export class NextJSLambdaEdge extends Construct {
  private routesManifest: RoutesManifest | null;

  private apiBuildManifest: OriginRequestApiHandlerManifest | null;

  private imageManifest: OriginRequestImageHandlerManifest | null;

  private defaultManifest: OriginRequestDefaultHandlerManifest;

  private prerenderManifest: PreRenderedManifest;

  public distribution: cloudfront.Distribution;

  public bucket: s3.Bucket;

  public defaultNextLambda: cloudfront.experimental.EdgeFunction;

  public nextApiLambda: cloudfront.experimental.EdgeFunction | null;

  public nextImageLambda: cloudfront.experimental.EdgeFunction | null;

  public nextStaticsCachePolicy: cloudfront.CachePolicy;

  public nextImageCachePolicy: cloudfront.CachePolicy;

  public nextLambdaCachePolicy: cloudfront.CachePolicy;

  public aRecord?: ARecord;

  public regenerationQueue?: sqs.Queue;

  public regenerationFunction?: cloudfront.experimental.EdgeFunction;

  constructor(scope: Construct, id: string, private props: Props) {
    super(scope, id);
    this.apiBuildManifest = this.readApiBuildManifest();
    this.routesManifest = this.readRoutesManifest();
    this.imageManifest = this.readImageBuildManifest();
    this.defaultManifest = this.readDefaultManifest();
    this.prerenderManifest = this.readPrerenderManifest();
    this.bucket = new s3.Bucket(this, 'PublicAssets', {
      bucketName: `${props.fullName}-assets-bucket`,
      publicReadAccess: false, // CloudFront/Lambdas are granted access so we don't want it publicly available

      // Given this resource is created internally and also should only contain
      // assets uploaded by this library we should be able to safely delete all
      // contents along with the bucket its self upon stack deletion.
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // Override props.
      ...(props.s3Props || {}),
    });

    const hasISRPages = Object.keys(this.prerenderManifest.routes).some(
      (key) =>
        typeof this.prerenderManifest.routes[key].initialRevalidateSeconds ===
        'number'
    );

    const hasDynamicISRPages = Object.keys(
      this.prerenderManifest.dynamicRoutes
    ).some(
      (key) => this.prerenderManifest.dynamicRoutes[key].fallback !== false
    );

    if (hasISRPages || hasDynamicISRPages) {
      this.regenerationQueue = new sqs.Queue(this, 'RegenerationQueue', {
        // We call the queue the same name as the bucket so that we can easily
        // reference it from within the lambda@edge, given we can't use env vars
        // in a lambda@edge
        queueName: `${this.bucket.bucketName}.fifo`,
        fifo: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      this.regenerationFunction = new cloudfront.experimental.EdgeFunction(
        this,
        'RegenerationFunction',
        {
          handler: 'index.handler',
          code: lambda.Code.fromAsset(
            path.join(this.props.serverlessBuildOutDir, 'regeneration-lambda')
          ),
          runtime:
            toLambdaOption('regenerationLambda', props.runtime) ??
            lambda.Runtime.NODEJS_14_X,
          memorySize:
            toLambdaOption('regenerationLambda', props.memory) ?? undefined,
          timeout:
            toLambdaOption('regenerationLambda', props.timeout) ??
            Duration.seconds(30),
        }
      );

      this.regenerationFunction.addEventSource(
        new lambdaEventSources.SqsEventSource(this.regenerationQueue)
      );
    }

    this.defaultNextLambda = new cloudfront.experimental.EdgeFunction(
      this,
      'NextLambda',
      {
        functionName: toLambdaOption('defaultLambda', props.name),
        description: `Default Lambda@Edge for Next CloudFront distribution`,
        handler: props.handler || 'index.handler',
        currentVersionOptions: {
          removalPolicy: RemovalPolicy.RETAIN, // retain old versions to prevent premature removal, cleanup via trigger later on
        },
        logRetention: logs.RetentionDays.THREE_DAYS,
        code: lambda.Code.fromAsset(
          path.join(this.props.serverlessBuildOutDir, 'default-lambda')
        ),

        runtime:
          toLambdaOption('defaultLambda', props.runtime) ??
          lambda.Runtime.NODEJS_12_X,
        memorySize: toLambdaOption('defaultLambda', props.memory) ?? 512,
        timeout:
          toLambdaOption('defaultLambda', props.timeout) ??
          Duration.seconds(10),
      }
    );

    addPermsToFunction(
      this,
      this.defaultNextLambda,
      props.extraPolicyStatements,
      props.fullName
    );

    this.bucket.grantReadWrite(this.defaultNextLambda);
    this.defaultNextLambda.currentVersion.addAlias('live');

    if ((hasISRPages || hasDynamicISRPages) && this.regenerationFunction) {
      this.bucket.grantReadWrite(this.regenerationFunction);
      this.regenerationQueue?.grantSendMessages(this.defaultNextLambda);
      this.regenerationFunction?.grantInvoke(this.defaultNextLambda);
    }

    const apis = this.apiBuildManifest?.apis;
    const hasAPIPages =
      apis &&
      (Object.keys(apis.nonDynamic).length > 0 ||
        Object.keys(apis.dynamic).length > 0);

    this.nextApiLambda = null;
    if (hasAPIPages) {
      this.nextApiLambda = new cloudfront.experimental.EdgeFunction(
        this,
        'NextApiLambda',
        {
          functionName: toLambdaOption('apiLambda', props.name),
          description: `Default Lambda@Edge for Next API CloudFront distribution`,
          handler: 'index.handler',
          currentVersionOptions: {
            removalPolicy: RemovalPolicy.DESTROY, // destroy old versions
            retryAttempts: 1, // async retry attempts
          },
          logRetention: logs.RetentionDays.THREE_DAYS,
          code: lambda.Code.fromAsset(
            path.join(this.props.serverlessBuildOutDir, 'api-lambda')
          ),
          runtime:
            toLambdaOption('apiLambda', props.runtime) ??
            lambda.Runtime.NODEJS_12_X,
          memorySize: toLambdaOption('apiLambda', props.memory) ?? 512,
          timeout:
            toLambdaOption('apiLambda', props.timeout) ?? Duration.seconds(10),
        }
      );
      this.nextApiLambda.currentVersion.addAlias('live');
    }

    addPermsToFunction(
      this,
      this.nextApiLambda,
      props.extraPolicyStatements,
      props.fullName
    );

    this.nextImageLambda = null;
    if (this.imageManifest) {
      this.nextImageLambda = new cloudfront.experimental.EdgeFunction(
        this,
        'NextImageLambda',
        {
          functionName: toLambdaOption('imageLambda', props.name),
          description: `Default Lambda@Edge for Next Image CloudFront distribution`,
          handler: 'index.handler',
          currentVersionOptions: {
            removalPolicy: RemovalPolicy.DESTROY, // destroy old versions
            retryAttempts: 1, // async retry attempts
          },
          logRetention: logs.RetentionDays.THREE_DAYS,
          code: lambda.Code.fromAsset(
            path.join(this.props.serverlessBuildOutDir, 'image-lambda')
          ),
          runtime:
            toLambdaOption('imageLambda', props.runtime) ??
            lambda.Runtime.NODEJS_12_X,
          memorySize: toLambdaOption('imageLambda', props.memory) ?? 512,
          timeout:
            toLambdaOption('imageLambda', props.timeout) ??
            Duration.seconds(10),
        }
      );
      this.nextImageLambda.currentVersion.addAlias('live');
      addPermsToFunction(
        this,
        this.nextImageLambda,
        props.extraPolicyStatements,
        props.fullName
      );
    }

    this.nextStaticsCachePolicy =
      props.nextStaticsCachePolicy ||
      new cloudfront.CachePolicy(this, 'NextStaticsCache', {
        cachePolicyName: props.cachePolicyName?.staticsCache,
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        defaultTtl: Duration.days(30),
        maxTtl: Duration.days(30),
        minTtl: Duration.days(30),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      });

    this.nextImageCachePolicy =
      props.nextImageCachePolicy ||
      new cloudfront.CachePolicy(this, 'NextImageCache', {
        cachePolicyName: props.cachePolicyName?.imageCache,
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
        headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
        defaultTtl: Duration.days(1),
        maxTtl: Duration.days(365),
        minTtl: Duration.days(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      });

    this.nextLambdaCachePolicy =
      props.nextLambdaCachePolicy ||
      new cloudfront.CachePolicy(this, 'NextLambdaCache', {
        cachePolicyName: props.cachePolicyName?.lambdaCache,
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
        headerBehavior: props.whiteListedHeaders
          ? cloudfront.CacheHeaderBehavior.allowList(
              ...props.whiteListedHeaders
            )
          : cloudfront.CacheHeaderBehavior.none(),
        cookieBehavior: {
          behavior: props.whiteListedCookies?.length ? 'whitelist' : 'all',
          cookies: props.whiteListedCookies,
        },
        defaultTtl: Duration.seconds(0),
        maxTtl: Duration.days(365),
        minTtl: Duration.seconds(0),
        enableAcceptEncodingBrotli: true,
        enableAcceptEncodingGzip: true,
      });

    const edgeLambdas: cloudfront.EdgeLambda[] = [
      {
        includeBody: true,
        eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
        functionVersion: this.defaultNextLambda.currentVersion,
      },
      {
        eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
        functionVersion: this.defaultNextLambda.currentVersion,
      },
    ];

    const {
      edgeLambdas: additionalDefaultEdgeLambdas = [],
      ...defaultBehavior
    } = props.defaultBehavior || {};

    this.distribution = new cloudfront.Distribution(
      this,
      'NextJSDistribution',
      {
        enableLogging: props.withLogging ? true : undefined,
        certificate: props.domain?.certificate,
        domainNames: props.domain ? props.domain.domainNames : undefined,
        defaultRootObject: '',
        defaultBehavior: {
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new origins.S3Origin(this.bucket),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: this.nextLambdaCachePolicy,
          edgeLambdas: [...edgeLambdas, ...additionalDefaultEdgeLambdas],
          ...(defaultBehavior || {}),
        },
        additionalBehaviors: {
          ...(this.nextImageLambda
            ? {
                [this.pathPattern('_next/image*')]: {
                  viewerProtocolPolicy:
                    cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                  origin: new origins.S3Origin(this.bucket),
                  allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                  cachedMethods:
                    cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
                  compress: true,
                  cachePolicy: this.nextImageCachePolicy,
                  originRequestPolicy: new cloudfront.OriginRequestPolicy(
                    this,
                    'ImageOriginRequest',
                    {
                      queryStringBehavior:
                        OriginRequestQueryStringBehavior.all(),
                    }
                  ),
                  edgeLambdas: [
                    {
                      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                      functionVersion: this.nextImageLambda.currentVersion,
                    },
                  ],
                },
              }
            : {}),
          [this.pathPattern('_next/data/*')]: {
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            origin: new origins.S3Origin(this.bucket),
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
            compress: true,
            cachePolicy: this.nextLambdaCachePolicy,
            edgeLambdas,
          },
          [this.pathPattern('_next/*')]: {
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            origin: new origins.S3Origin(this.bucket),
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
            compress: true,
            cachePolicy: this.nextStaticsCachePolicy,
          },
          [this.pathPattern('static/*')]: {
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            origin: new origins.S3Origin(this.bucket),
            allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
            compress: true,
            cachePolicy: this.nextStaticsCachePolicy,
          },
          ...(this.nextApiLambda
            ? {
                [this.pathPattern('api/*')]: {
                  viewerProtocolPolicy:
                    cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                  origin: new origins.S3Origin(this.bucket),
                  allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                  cachedMethods:
                    cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
                  compress: true,
                  cachePolicy: this.nextLambdaCachePolicy,
                  edgeLambdas: [
                    {
                      includeBody: true,
                      eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                      functionVersion: this.nextApiLambda.currentVersion,
                    },
                  ],
                },
              }
            : {}),
          ...(props.behaviours || {}),
        },
        // Override props.
        ...(props.cloudfrontProps || {}),
      }
    );

    const assetsDirectory = path.join(props.serverlessBuildOutDir, 'assets');
    const { basePath } = this.routesManifest || {};
    const normalizedBasePath =
      basePath && basePath.length > 0 ? basePath.slice(1) : '';
    const assets = readAssetsDirectory({
      assetsDirectory: path.join(assetsDirectory, normalizedBasePath),
    });

    // This `BucketDeployment` deploys just the BUILD_ID file. We don't actually
    // use the BUILD_ID file at runtime, however in this case we use it as a
    // file to allow us to create an invalidation of all the routes as evaluated
    // in the function `readInvalidationPathsFromManifest`.
    new s3Deploy.BucketDeployment(this, `AssetDeploymentBuildID`, {
      destinationBucket: this.bucket,
      sources: [
        s3Deploy.Source.asset(assetsDirectory, {
          exclude: ['**', '!BUILD_ID'],
        }),
      ],
      // This will actually cause the file to exist at BUILD_ID, we do this so
      // that the prune will only prune /BUILD_ID/*, rather than all files fromm
      // the root upwards.
      destinationKeyPrefix: '/BUILD_ID',
      distribution: this.distribution,
      distributionPaths:
        props.invalidationPaths ||
        reduceInvalidationPaths(
          readInvalidationPathsFromManifest(this.defaultManifest)
        ),
    });

    Object.keys(assets).forEach((key) => {
      const { path: assetPath, cacheControl } = assets[key];
      new s3Deploy.BucketDeployment(this, `AssetDeployment_${key}`, {
        destinationBucket: this.bucket,
        sources: [s3Deploy.Source.asset(assetPath)],
        cacheControl: [s3Deploy.CacheControl.fromString(cacheControl)],

        // The source contents will be unzipped to and loaded into the S3 bucket
        // at the root '/', we don't want this, we want to maintain the same
        // path on S3 as their local path. Note that this should be a posix path.
        destinationKeyPrefix: pathToPosix(
          path.relative(assetsDirectory, assetPath)
        ),

        // Source directories are uploaded with `--sync` this means that any
        // files that don't exist in the source directory, but do in the S3
        // bucket, will be removed.
        prune: true,
      });
    });

    if (props.domain?.hostedZone) {
      const hostedZone = props.domain.hostedZone;
      props.domain.domainNames.forEach((domainName, index) => {
        this.aRecord = new ARecord(this, `AliasRecord_${index}`, {
          recordName: domainName,
          zone: hostedZone,
          target: RecordTarget.fromAlias(
            new CloudFrontTarget(this.distribution)
          ),
        });
      });
    }
  }

  private pathPattern(pattern: string): string {
    const { basePath } = this.routesManifest || {};
    return basePath && basePath.length > 0
      ? `${basePath.slice(1)}/${pattern}`
      : pattern;
  }

  private readRoutesManifest(): RoutesManifest {
    return fs.readJSONSync(
      path.join(
        this.props.serverlessBuildOutDir,
        'default-lambda/routes-manifest.json'
      )
    );
  }

  private readDefaultManifest(): OriginRequestDefaultHandlerManifest {
    return fs.readJSONSync(
      path.join(
        this.props.serverlessBuildOutDir,
        'default-lambda/manifest.json'
      )
    );
  }

  private readPrerenderManifest(): PreRenderedManifest {
    return fs.readJSONSync(
      path.join(
        this.props.serverlessBuildOutDir,
        'default-lambda/prerender-manifest.json'
      )
    );
  }

  private readApiBuildManifest(): OriginRequestApiHandlerManifest | null {
    const apiPath = path.join(
      this.props.serverlessBuildOutDir,
      'api-lambda/manifest.json'
    );
    if (!fs.existsSync(apiPath)) return null;
    return fs.readJsonSync(apiPath);
  }

  private readImageBuildManifest(): OriginRequestImageHandlerManifest | null {
    const imageLambdaPath = path.join(
      this.props.serverlessBuildOutDir,
      'image-lambda/manifest.json'
    );

    return fs.existsSync(imageLambdaPath)
      ? fs.readJSONSync(imageLambdaPath)
      : null;
  }
}
