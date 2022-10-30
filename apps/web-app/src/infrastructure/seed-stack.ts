import { CognitoSeeder } from '@tnmw/seed-cognito';
import { DynamoSeeder } from '@tnmw/seed-dynamo';
import { Stack, StackProps } from 'aws-cdk-lib';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { exclusions } from './seed-data/exclusions';
import { recipes } from './seed-data/recipes';
import { SEED_USERS } from './seed-users';

interface SeedStackProps {
  stackProps: StackProps;
  recipesTable: ITable;
  customisationsTable: ITable;
  userPool: IUserPool;
}

export class SeedStack extends Stack {
  constructor(scope: Construct, id: string, props: SeedStackProps) {
    super(scope, id, props.stackProps);

    new CognitoSeeder(this, `cognito-seeder`, {
      userpool: props.userPool,
      users: SEED_USERS,
    });

    new DynamoSeeder(this, `recipes-seeder`, {
      table: props.recipesTable,
      data: recipes,
    });

    new DynamoSeeder(this, `customisations-seeder`, {
      table: props.customisationsTable,
      data: exclusions,
    });
  }
}
