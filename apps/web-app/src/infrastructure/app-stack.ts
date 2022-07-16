import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import path from 'node:path';
import { deployStatics } from './deploy-statics';
import { makeDataApis } from './make-data-apis';
import { makeUserPool } from './make-user-pool';
import { setupFrontDoor } from './setup-front-door';
import { E2E } from '@tnmw/constants';

interface TnmAppProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
}

// eslint-disable-next-line unicorn/prefer-module
const packageRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(packageRoot, '..', '..');

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: TnmAppProps) {
    super(scope, id, props.stackProps);

    const transient = props.envName !== 'prod';

    const { userPool, client } = makeUserPool(this, transient, props.envName);

    if (transient) {
      new CognitoSeeder(this, `cognito-seeder`, {
        userpool: userPool,
        users: [
          {
            username: E2E.adminUserOne.username,
            password: E2E.adminUserOne.password,
            email: E2E.adminUserOne.email,
            state: 'Complete',
            groups: ['admin'],
          },
          {
            username: E2E.normalUserOne.username,
            password: E2E.normalUserOne.password,
            email: E2E.normalUserOne.email,
            state: 'Complete',
          },
        ],
      });
    }

    const dir = path.join(
      // eslint-disable-next-line unicorn/prefer-module
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'dist',
      'apps',
      'web-app'
    );

    // const serverlessNextjs = new ServerlessNextjs(scope, 'NextJs', {
    //   nextjsArtifact: NextjsArtifact.fromBuild({
    //     nextjsDirectory: dir,
    //     buildCommand: ['yarn', 'build', 'web-app'],
    //   }),
    // });

    // const { httpOrigin } = makePagesApi(
    //   this,
    //   path.resolve(packageRoot, 'out_lambda'),
    //   props.envName,
    //   path.resolve(repoRoot, 'dist', 'apps', 'web-app', '.next'),
    //   userPool,
    //   client,
    //   props.forceUpdateKey
    // );

    const { distribution, hostedZone } = setupFrontDoor(
      this,
      props.envName,
      serverlessNextjs
    );

    deployStatics(this, props.envName, distribution);

    makeDataApis(
      this,
      hostedZone,
      props.envName,
      userPool,
      props.chargebeeSite,
      props.forceUpdateKey
    );
  }
}
