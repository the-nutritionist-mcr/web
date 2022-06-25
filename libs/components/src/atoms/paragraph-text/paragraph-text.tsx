import styled from '@emotion/styled';
import { FC } from 'react';

const StyledP = styled.p`
  font-family: 'IBM Plex Serif', 'Times New Roman', serif;
  line-height: 23px;
`;

const ParagraphText: FC = (props) => {
  return <StyledP>{props.children}</StyledP>;
};

export default ParagraphText;
