import {
  CachePolicy,
  CacheQueryStringBehavior,
  Distribution,
} from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import path from 'node:path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { HTTP } from '@tnmw/constants';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Duration } from 'aws-cdk-lib';

const namer = (id: string) => {
  return {
    id: (resourceName: string) => `${id}/${resourceName}`,
  };
};

interface ImageOptimisationProps {
  assetsPath: string;
  distribution: Distribution;
}

export class ImageOptimisation extends Construct {
  constructor(
    context: Construct,
    resourceId: string,
    props: ImageOptimisationProps
  ) {
    super(context, resourceId);

    const { id } = namer(resourceId);

    const bucket = new Bucket(this, id('image-bucket'), {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    });

    const optimisationFunction = new NodejsFunction(this, id('function'), {
      entry: `${path.join(
        // eslint-disable-next-line unicorn/prefer-module
        __dirname,
        `handler`,
        `handler.ts`
      )}`,
      timeout: Duration.minutes(5),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      bundling: {
        nodeModules: ['sharp'],
      },
      runtime: Runtime.NODEJS_16_X,
    });

    const api = new RestApi(context, id('image-api'), {
      binaryMediaTypes: ['image/jpeg'],
      defaultCorsPreflightOptions: {
        allowMethods: [HTTP.verbs.Get],
        allowOrigins: ['*'],
      },
    });

    props.distribution.addBehavior('/images/*', new RestApiOrigin(api), {
      cachePolicy: new CachePolicy(this, id('cache-policy'), {
        queryStringBehavior: CacheQueryStringBehavior.all(),
      }),
    });

    const images = api.root.addResource('images');
    const getImage = images.addResource('{file}');

    getImage.addMethod(
      HTTP.verbs.Get,
      new LambdaIntegration(optimisationFunction)
    );

    bucket.grantReadWrite(optimisationFunction);

    new BucketDeployment(this, id('bucket-deployment'), {
      sources: [Source.asset(props.assetsPath)],
      destinationBucket: bucket,
      distribution: props.distribution,
      destinationKeyPrefix: `raw/`,
      distributionPaths: ['/images/*'],
    });
  }
}
