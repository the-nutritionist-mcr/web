import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RemoteOutputs } from 'cdk-remote-stack';
import { Construct } from 'constructs';

const app = new App();
const stack = new Stack(app, 'id');

const func = new Function(stack, 'function', {
  runtime: Runtime.NODEJS_16_X,
  code: Code.fromInline("console.log('hello')"),
  handler: 'index.handler',
});

class Handler implements ProxyHandler<Construct> {
  private outputs: { [outputName: string]: CfnOutput } = {};

  private outputs = new RemoteOutputs(stackUS, 'Outputs', { stack: stackJP });

  get(target: Construct, prop: string | symbol) {
    const stack = Stack.of(target);
    const outputName = `${target.node.id}-${prop}`;

    const value = target[prop];

    new CfnOutput(stack, outputName, {
      value,
    });

    return value;
  }
}

const proxyHandler: ProxyHandler<Construct> = {
  construct() {
    return Reflect.construct(...arguments);
  },
};

const crossStackProxy = new Proxy(func, proxyHandler);
