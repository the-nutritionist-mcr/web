import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { AppStack } from './stacks/app-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AppStack(app, 'testTestStack');
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
