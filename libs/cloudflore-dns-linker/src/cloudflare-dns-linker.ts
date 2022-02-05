import { Construct, CustomResource } from '@aws-cdk/core';
import path from 'node:path';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { Runtime } from '@aws-cdk/aws-lambda';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { Provider } from '@aws-cdk/custom-resources';
import {
  CLOUDFLARE_SITE_ENV_KEYNAME,
  CLOUDFLARE_TOKEN_ENV_KEYNAME,
} from './constants';

interface CloudflareLinkerProps {
  cloudflareToken: string;
  cloudflareSite: string;
  hostedZone: IHostedZone;
}

export class CloudflareLinker extends Construct {
  constructor(context: Construct, id: string, props: CloudflareLinkerProps) {
    super(context, id);

    const linkerFunction = new NodejsFunction(context, `${id}-seeder-handler`, {
      // eslint-disable-next-line unicorn/prefer-module
      entry: path.resolve(__dirname, 'handler.ts'),
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        sourceMap: true,
      },
      environment: {
        [CLOUDFLARE_SITE_ENV_KEYNAME]: props.cloudflareToken,
        [CLOUDFLARE_TOKEN_ENV_KEYNAME]: props.cloudflareSite,
      },
    });

    const provider = new Provider(this, `${id}-provider`, {
      onEventHandler: linkerFunction,
      logRetention: RetentionDays.ONE_DAY,
    });

    const seederResource = new CustomResource(this, `${id}-resource`, {
      serviceToken: provider.serviceToken,
    });

    seederResource.node.addDependency(props.hostedZone);
  }
}
