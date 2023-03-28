import styled from '@emotion/styled';
import { ReactNode } from 'react';

const StyledP = styled.p`
  font-family: ibm-plex-serif, 'Times New Roman', serif;
  line-height: 23px;
`;

interface ParagraphTextProps {
  children: ReactNode;
}

const ParagraphText = (props: ParagraphTextProps) => {
  return <StyledP>{props.children}</StyledP>;
};

export default ParagraphText;
