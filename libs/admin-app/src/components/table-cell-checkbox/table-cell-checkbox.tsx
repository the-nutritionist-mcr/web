import { CheckBox } from "grommet";
import MutatorFieldProps from "../MutatorFieldProps";
import React from "react";

interface InputFieldProps {
  value?: string | number | (string & readonly string[]) | undefined;
  name: string;
  checked: boolean;
}

function assertFC<P>(
  _component: React.FC<P>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
): asserts _component is React.FC<P> {}

function TableCellCheckbox<T>(
  props: MutatorFieldProps<T, React.ChangeEvent<HTMLInputElement>> &
    InputFieldProps
): React.ReactElement | null {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newThing = { ...props.thing };
    props.mutator(newThing, event);
    props.onChange(newThing);
  };

  return (
    <CheckBox
      toggle
      name={props.name}
      onChange={onChange}
      checked={props.checked}
      placeholder="None"
    />
  );
}

assertFC(TableCellCheckbox);

export default TableCellCheckbox;
