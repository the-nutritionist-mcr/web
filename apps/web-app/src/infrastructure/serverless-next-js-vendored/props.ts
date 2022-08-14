import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  BehaviorOptions,
  DistributionProps,
  CachePolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { BucketProps } from 'aws-cdk-lib/aws-s3';
import { Duration, StackProps } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export type LambdaOption<T> =
  | T
  | {
      defaultLambda?: T;
      apiLambda?: T;
      imageLambda?: T;
      regenerationLambda?: T;
    };

export interface Props extends StackProps {
  /**
   * The directory that holds the output from the serverless builder.
   *
   * i.e. `serverlessBuildOutDir: new Builder(entry, outDir, {...}).outputDir`
   */
  serverlessBuildOutDir: string;

  fullName: string;

  extraPolicyStatements: PolicyStatement[];
  /**
   * If you'd like a custom domain for your site, you'll need to pass in a list
   * of full `domainNames` and a `certificate`.
   *
   * If your domain is hosted on Route53, you can pass a `hostedZone`, for
   * which an A record will be automatically created. Otherwise, you can access
   * the distribution information via the `distribution` property on the
   * `NextJSLambdaEdge` construct instance, for external DNS configuration.
   */
  domain?: {
    hostedZone?: IHostedZone;
    certificate: ICertificate;
    domainNames: string[];
  };
  /**
   * Override props passed to the underlying s3 bucket
   */
  s3Props?: Partial<BucketProps>;
  /**
   * Lambda memory limit(s)
   */
  memory?: LambdaOption<number>;
  /**
   * Lambda timeout(s)
   */
  timeout?: LambdaOption<Duration>;
  /**
   * Lambda name(s)
   */
  name?: LambdaOption<string>;
  /**
   * Lambda runtimes(s)
   */
  runtime?: LambdaOption<Runtime>;
  /**
   * Cache Policy Name(s)
   */
  cachePolicyName?: {
    staticsCache?: string;
    imageCache?: string;
    lambdaCache?: string;
  };
  /**
   * If you use a custom handler with `.build()`, you can set the handler here.
   */
  handler?: string;

  /**
   * Enable logging on the cloudfront distribution
   */
  withLogging?: boolean;
  /**
   * Provide a list of cookies to forward to the CloudFront origin.
   *
   * This is useful if your SSR page is different based on the user requesting
   * it, so you might for example cache based on the user's authentication token.
   *
   * .e.g ['my-apps-auth-token-cookie-key']
   */
  whiteListedCookies?: string[];

  /**
   * Provide a list of headers to forward to the CloudFront origin.
   * This is useful if your SSR page is depending on headers from the request.
   */
  whiteListedHeaders?: string[];

  /**
   * Provide a subset (or all) of the props to override the CloudFront
   * distributions default props.
   */
  defaultBehavior?: Partial<BehaviorOptions>;
  /**
   * Optionally pass one or many custom CloudFront behaviours.
   *
   * This is handy if you want to adjust how certain assets are cached, or add
   * another `lambda@edge` endpoint.
   */
  behaviours?: Record<string, BehaviorOptions>;
  /**
   * Pass an array of invalidation paths. By default this construct  will
   * invalidate all paths found in your pages manifest. You can reduce the
   * number of invalidations created by invalidating all paths using:
   * ```ts
   * invalidationPaths: ["/*"]
   * ```
   */
  invalidationPaths?: string[];
  /**
   * Override props passed to the underlying s3 bucket
   */
  cloudfrontProps?: Partial<DistributionProps>;

  /**
   * Override cache policy used for statics
   */
  nextStaticsCachePolicy?: CachePolicy;

  /**
   * Override cache policy used for image caching
   */

  nextImageCachePolicy?: CachePolicy;

  /**
   * Override cache policy used for Lambda
   */
  nextLambdaCachePolicy?: CachePolicy;
}
