import styled from '@emotion/styled';
import { ReactNode } from 'react';

export interface TabProps {
  tabTitle: string;
  children: ReactNode;
}

const TabContents = styled.div`
  width: 100%;
  text-align: right;
`;

const Tab = (props: TabProps) => {
  return <TabContents role="tabpanel">{props.children}</TabContents>;
};

export default Tab;
