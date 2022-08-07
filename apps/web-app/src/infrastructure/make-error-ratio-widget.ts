import { MathExpression, SingleValueWidget } from 'aws-cdk-lib/aws-cloudwatch';
import { Function } from 'aws-cdk-lib/aws-lambda';

// eslint-disable-next-line @typescript-eslint/ban-types
export const makeErrorRatioWidget = (func: Function) => {
  const problemPercentage = new MathExpression({
    expression: '(errors / invocations) * 100',
    usingMetrics: {
      errors: func.metricErrors(),
      invocations: func.metricInvocations(),
    },
  });

  return new SingleValueWidget({
    metrics: [problemPercentage],
    fullPrecision: false,
    title: `${func.functionName} error ratio`,
  });
};
