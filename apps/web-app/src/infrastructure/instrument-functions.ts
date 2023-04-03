import { IAM } from '@tnmw/constants';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Datadog } from 'datadog-cdk-constructs-v2';

export const DATADOG_API_KEY_SECRET_ARN =
  'arn:aws:secretsmanager:us-east-1:568693217207:secret:tnm-app/datadog-api-key-8qKjFO';

const contexts: { [ids: string]: Datadog } = {};

export const instrumentFunctions = (
  context: Construct,
  envName: string,
  gitHash: string | undefined,
  // eslint-disable-next-line @typescript-eslint/ban-types
  ...funcs: (Function | undefined)[]
) => {
  if (!(context.node.id in contexts)) {
    contexts[context.node.id] = new Datadog(
      context,
      `datadog-instrumentation-${context.node.id}`,
      {
        site: 'datadoghq.eu',
        apiKeySecretArn: DATADOG_API_KEY_SECRET_ARN,
        nodeLayerVersion: 81,
        flushMetricsToLogs: true,
        enableDatadogTracing: true,
        enableDatadogLogs: true,
        injectLogContext: true,
        extensionLayerVersion: 27,
        env: envName,
        addLayers: true,
        service: 'tnm-web',
        tags: 'git.repository_url:https://github.com/the-nutritionist-mcr/web',
      }
    );
  }

  const getDatadogSecretPolicy = new PolicyStatement({
    actions: [IAM.actions.secretsManager.getSecret],
    effect: Effect.ALLOW,
    resources: [DATADOG_API_KEY_SECRET_ARN],
  });

  const allPresentFuncs = funcs.flatMap((item) => (item ? [item] : []));

  allPresentFuncs.forEach((func) => {
    if (gitHash) {
      contexts[context.node.id].addGitCommitMetadata([func], gitHash);
    }
    func.addToRolePolicy(getDatadogSecretPolicy);
  });

  contexts[context.node.id].addLambdaFunctions(allPresentFuncs);
};
