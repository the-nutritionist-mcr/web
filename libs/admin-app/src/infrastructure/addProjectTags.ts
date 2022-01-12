import * as cdk from "@aws-cdk/core";

const addProjectTags = (name: string, constructs: cdk.IConstruct[]): void => {
  constructs.forEach((construct) =>
    cdk.Tags.of(construct).add("project", name)
  );
};

export default addProjectTags;
