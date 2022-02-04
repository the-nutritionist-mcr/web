import * as cdk from '@aws-cdk/core';
import * as certificateManager from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import addProjectTags from './addProjectTags';

interface ProductionFrontendStackProps {
  subdomain: string;
  domainName: string;
}

export default class ProductionFrontendStack extends cdk.Stack {
  public constructor(
    scope: cdk.Construct,
    id: string,
    props: cdk.StackProps & ProductionFrontendStackProps
  ) {
    super(scope, id, props);

    const fullUrl = [props.subdomain, props.domainName].join('.');

    const bucket = new s3.Bucket(this, 'ProductionFrontendStackBucket', {
      bucketName: fullUrl,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    const zone = route53.HostedZone.fromLookup(
      this,
      'ProductionFrontendStackHostedZone',
      {
        domainName: props.domainName,
      }
    );

    const domainName = props.subdomain === 'www' ? props.domainName : fullUrl;
    const subjectAlternativeNames =
      props.subdomain === 'www' ? [fullUrl] : undefined;

    const certificate = new certificateManager.DnsValidatedCertificate(
      this,
      'ProductionFrontendStackCertificate',
      {
        domainName,
        hostedZone: zone,
        subjectAlternativeNames,
      }
    );

    const aliases =
      props.subdomain === 'www' ? [props.domainName, fullUrl] : [fullUrl];

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'ProductionFrontendStackDistro',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 403,
            responsePagePath: '/index.html',
            responseCode: 200,
          },
        ],
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          { aliases }
        ),
      }
    );

    new s3Deploy.BucketDeployment(this, 'ProductionFrontendStackDeployment', {
      sources: [s3Deploy.Source.asset('./build')],
      destinationBucket: bucket,
      distribution,
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: distribution.distributionId,
    });

    const aRecord = new route53.ARecord(
      this,
      'ProductionFrontendStackARecord',
      {
        zone,
        recordName: fullUrl,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(distribution)
        ),
      }
    );

    // If (props.subdomain === "www") {
    //   new route53.CnameRecord(this, "ProductionFrontendStackCnameRecord", {
    //     zone,
    //     domainName: props.domainName,
    //     recordName: fullUrl,
    //   });
    // }

    addProjectTags('TnmAdmin', [
      bucket,
      aRecord,
      distribution,
      certificate,
      zone,
    ]);
  }
}
