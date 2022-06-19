import { FC } from 'react';

import styled from '@emotion/styled';
import { OurStory as OurStoryComponent } from '@tnmw/static-pages';

const StyledDiv = styled.div`
  padding: 1rem;
`;

const OurStory: FC = () => {
  return <OurStoryComponent />;
};

export default OurStory;
