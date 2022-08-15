import { CfnOutput } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { RemoteOutputs } from 'cdk-remote-stack';

export const wrapConstruct = <T extends Construct>(
  source: T,
  target: Construct
): T => {
  const outputs = new RemoteOutputs(source, 'Outputs', { stack: target });
  target.node.addDependency(source);

  const handler: ProxyHandler<T> = {
    get(target, prop: keyof typeof target & string) {
      const value = target[prop];
      const outputName = `${target.node.id}${prop as string}`;
      if (typeof value === 'string') {
        new CfnOutput(target, outputName, {
          value,
        });
      }

      return outputs.get(outputName);
    },
  };

  return new Proxy(source, handler);
};
