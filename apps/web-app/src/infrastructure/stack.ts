import { App, Stack, StackProps, Construct } from "@aws-cdk/core";
import * as path from "path";
import { makeUserPool } from "./make-user-pool";
import { makePagesApi } from "./make-pages-api";
import { setupFrontDoor } from "./setup-front-door";
import { deployStatics } from "./deploy-statics";

interface TnmAppProps {
  stackProps: StackProps;
  envName: string;
  transient: boolean;
}

const packageRoot = path.resolve(__dirname, "..", "..");

class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: TnmAppProps) {
    super(scope, id, props.stackProps);

    const transient = props.envName !== "prod";

    const { userPool } = makeUserPool(this, transient, props.envName);

    const { httpOrigin } = makePagesApi(
      this,
      path.resolve(packageRoot, "out_lambda"),
      props.envName,
      packageRoot,
      userPool
    );

    const { distribution } = setupFrontDoor(this, props.envName, httpOrigin);

    deployStatics(
      this,
      path.resolve(packageRoot, "public"),
      path.resolve(packageRoot, ".next/static"),
      props.envName,
      distribution
    );
  }
}

const app = new App();

const account = process.env.IS_CDK_LOCAL ? "000000000000" : "568693217207";

const env = {
  account,
  region: "eu-west-2"
};

new AppStack(app, "tnm-v5-int-stack", {
  stackProps: { env },
  envName: "int",
  transient: true
});

new AppStack(app, "tnm-v5-cypress-stack", {
  stackProps: { env },
  envName: "cypress",
  transient: true
});

new AppStack(app, "tnm-v5-dev-stack", {
  stackProps: { env },
  envName: "dev",
  transient: true
});

new AppStack(app, "tnm-v5-test-stack", {
  stackProps: { env },
  envName: "test",
  transient: true
});

new AppStack(app, "tnm-v5-prod-stack", {
  stackProps: { env },
  envName: "prod",
  transient: false
});

app.synth();
