import { TextInput, ThemeContext } from "grommet";
import MutatorFieldProps from "../MutatorFieldProps";
import React from "react";
import { useDebouncedCallback } from "use-debounce";

interface InputFieldProps {
  value?: string | number | (string & readonly string[]) | undefined;
  type?: string | undefined;
  bold?: boolean;
  name?: string;
}

const BoldWeight = 600;
const NormalWeight = 200;
const DebounceTime = 500;

function assertFC<P>(
  _component: React.FC<P>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
): asserts _component is React.FC<P> {}

function TableCellInputField<T>(
  props: MutatorFieldProps<T, React.ChangeEvent<HTMLInputElement>> &
    InputFieldProps
): React.ReactElement | null {
  const [value, setValue] = React.useState(props.value);

  const theme = {
    global: {
      input: {
        font: {
          weight: props.bold ? BoldWeight : NormalWeight,
        },
      },
    },
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newThing = { ...props.thing };
    props.mutator(newThing, event);
    props.onChange(newThing);
  };

  const onChangeDebounced = useDebouncedCallback(onChange, DebounceTime);

  return (
    <ThemeContext.Extend value={theme}>
      <TextInput
        type={props.type}
        name={props.name}
        value={value}
        onChange={(event): void => {
          onChangeDebounced.callback(event);
          setValue(event.target.value);
        }}
        onBlur={onChange}
        placeholder="None"
        plain="full"
      />
    </ThemeContext.Extend>
  );
}

assertFC(TableCellInputField);

export default TableCellInputField;
