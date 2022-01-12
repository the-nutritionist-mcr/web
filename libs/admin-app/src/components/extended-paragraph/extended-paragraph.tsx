import { Paragraph, ParagraphProps } from "grommet";
import React from "react";
import styled from "styled-components";

const LimitedParagraph = styled(Paragraph)`
  max-width: 800px;
`;

const ExtendedParagraph: React.FC<ParagraphProps> = (props) => (
  <LimitedParagraph {...props} fill />
);

export default ExtendedParagraph;
