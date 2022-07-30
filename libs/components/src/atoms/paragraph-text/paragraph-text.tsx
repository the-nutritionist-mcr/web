import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

const StyledP = styled.p`
  font-family: 'IBM Plex Serif', 'Times New Roman', serif;
  line-height: 23px;
`;

interface ParagraphTextProps {
  children: ReactNode;
}

const ParagraphText = (props: ParagraphTextProps) => {
  return <StyledP>{props.children}</StyledP>;
};

export default ParagraphText;
