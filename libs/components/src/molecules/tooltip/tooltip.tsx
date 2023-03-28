import { ReactNode } from 'react';
import { tooltipContainer, tooltipText } from './tooltip.css';

interface ToolTipProps {
  children: ReactNode;
  text: string;
}

export const ToolTip = (props: ToolTipProps) => {
  return (
    <div className={tooltipContainer}>
      <div className={tooltipText}>{props.text}</div>
      {props.children}
    </div>
  );
};
