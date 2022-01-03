import { jsx as _jsx, jsxs as _jsxs } from "@emotion/react/jsx-runtime";
import styled from '@emotion/styled';
import { useState, Children, isValidElement, } from 'react';
import TabButton from './tab-button';
const ButtonRow = styled.div `
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const isTab = (node) => isValidElement(node) && 'tabTitle' in node.props;
const getTabs = (nodes) => {
    var _a, _b;
    return (_b = (_a = Children.map(nodes, (node) => isTab(node) ? node : undefined)) === null || _a === void 0 ? void 0 : _a.filter(Boolean)) !== null && _b !== void 0 ? _b : [];
};
const TabBox = (props) => {
    var _a;
    const tabs = getTabs(props.children);
    const defaultTabIndex = props.defaultTab
        ? tabs.findIndex((tab) => tab.props.tabTitle === props.defaultTab)
        : 0;
    const [tabIndex, setTabIndex] = useState(defaultTabIndex);
    const ButtonComponent = (_a = props.tabButton) !== null && _a !== void 0 ? _a : TabButton;
    const buttons = tabs.map((tab, index) => (_jsx(ButtonComponent, Object.assign({ tabListLength: tabs.length, onClick: () => {
            var _a;
            setTabIndex(index);
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, tab);
        }, active: tabIndex === index }, { children: tab.props.tabTitle }), index)));
    return (_jsxs("div", { children: [_jsx(ButtonRow, Object.assign({ role: "tablist" }, { children: buttons }), void 0), tabs[tabIndex]] }, void 0));
};
export default TabBox;
//# sourceMappingURL=tab-box.js.map