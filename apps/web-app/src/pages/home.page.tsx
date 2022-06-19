import { FC } from 'react';

import styled from '@emotion/styled';
import { IndexPage as IndexPageComponent } from '@tnmw/static-pages';

const StyledDiv = styled.div`
  padding: 1rem;
`;

const IndexPage: FC = () => {
  return <IndexPageComponent />;
};

export default IndexPage;
