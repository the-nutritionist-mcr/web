import { Heading, Paragraph } from "grommet";
import React from "react";

const NotFound: React.FC = () => (
  <>
    <Heading level={2}>Whoops!</Heading>
    <Paragraph fill>This page could not be found, sorry...</Paragraph>
  </>
);

export default NotFound;
