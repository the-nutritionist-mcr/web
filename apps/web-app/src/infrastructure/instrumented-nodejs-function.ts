import { ENV, IAM, NODE_OPTS } from '@tnmw/constants';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Datadog } from 'datadog-cdk-constructs-v2';
import { getResourceName } from './get-resource-name';

export const DATADOG_API_KEY_SECRET_ARN =
  'arn:aws:secretsmanager:us-east-1:568693217207:secret:tnm-app/datadog-api-key-8qKjFO';

const contexts: { [ids: string]: Datadog } = {};

export const makeInstrumentedFunctionGenerator = (
  context: Construct,
  envName: string,
  gitHash: string | undefined
) => {
  if (!(context.node.id in contexts)) {
    contexts[context.node.id] = new Datadog(
      context,
      'datadog-instrumentation',
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

  return (id: string, props?: NodejsFunctionProps | undefined) => {
    const defaultProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_16_X,
      functionName: getResourceName(id, envName),
      memorySize: 2048,
      bundling: {
        externalModules: ['dd-trace', 'datadog-lambda-js'],
        sourceMap: true,
      },
    };

    const mergedProps = props ? { ...defaultProps, ...props } : defaultProps;

    const defaultEnvirionmentVariables = {
      [ENV.varNames.NodeOptions]: NODE_OPTS.EnableSourceMaps,
      [ENV.varNames.EnvironmentName]: envName,
    };

    const environment = mergedProps.environment
      ? { ...defaultEnvirionmentVariables, ...mergedProps.environment }
      : defaultEnvirionmentVariables;

    const func = new NodejsFunction(context, id, {
      ...mergedProps,
      environment,
    });
    func.addToRolePolicy(getDatadogSecretPolicy);
    if (gitHash) {
      contexts[context.node.id].addGitCommitMetadata([func], gitHash);
    }
    contexts[context.node.id].addLambdaFunctions([func]);
    return func;
  };
};
