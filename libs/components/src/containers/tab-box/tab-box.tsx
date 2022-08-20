import styled from '@emotion/styled';
import {
  FC,
  useState,
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';
import { TabProps } from './tab';
import TabButton from './tab-button';

const ButtonRow = styled.div`
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

interface TabButtonProps {
  onClick?: () => void;
  active?: boolean;
  tabListLength: number;
}

interface TabBoxProps {
  tabButton?: FC<TabButtonProps>;
  onChange?: (tab: ReactElement<TabProps>) => void;
  onChangeIndex?: (which: number, length: number) => void;
  defaultTab?: string;
  currentTabIndex?: number;
  children: ReactNode;
}

const isTab = (node: ReactNode): node is ReactElement<TabProps> =>
  isValidElement(node) && 'tabTitle' in (node as ReactElement<TabProps>).props;

type ExcludesUndefined = <T>(x: T | undefined) => x is T;

const getTabs = (nodes: ReactNode): ReactElement<TabProps>[] =>
  Children.map<ReactElement<TabProps> | undefined, ReactNode>(nodes, (node) =>
    isTab(node) ? node : undefined
  )?.filter(Boolean as unknown as ExcludesUndefined) ?? [];

const TabBox = (props: TabBoxProps) => {
  const tabs = getTabs(props.children);

  const defaultTabIndex = props.defaultTab
    ? tabs.findIndex((tab) => tab.props.tabTitle === props.defaultTab)
    : 0;

  const [tabIndex, setTabIndex] = useState(defaultTabIndex);

  const activeTab = props.currentTabIndex ?? tabIndex;

  const ButtonComponent = props.tabButton ?? TabButton;
  const buttons = tabs.map((tab, index) => (
    <ButtonComponent
      tabListLength={tabs.length}
      key={index}
      onClick={() => {
        setTabIndex(index);
        props.onChange?.(tab);
        props.onChangeIndex?.(index, tabs.length);
      }}
      active={activeTab === index}
    >
      {tab.props.tabTitle}
    </ButtonComponent>
  ));
  return (
    <div>
      <ButtonRow role="tablist">{buttons}</ButtonRow>
      {/* eslint-disable-next-line security/detect-object-injection */}
      {tabs[activeTab]}
    </div>
  );
};

export default TabBox;
