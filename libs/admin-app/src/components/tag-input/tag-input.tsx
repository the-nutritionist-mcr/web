import { Box, Button, Select, Tag } from 'grommet';
import { useState } from 'react';
import Fuse from 'fuse.js';

interface ValueType {
  key: string;
  label: string;
}

interface TagInputProps {
  options: ValueType[];
  values: ValueType[];
  name?: string;
  onChange: (values: ValueType[]) => void;
}

export const TagInput = (props: TagInputProps) => {
  const [values, setValues] = useState(props.values);
  const [optionsFilter, setOptionsFilter] = useState<string | undefined>();
  const fuse = new Fuse(props.options, {
    keys: ['label'],
  });
  const filteredOptions = optionsFilter
    ? fuse.search(optionsFilter).map((result) => result.item)
    : props.options;
  return (
    <Box direction="row" gap="xsmall">
      {values.map((value) => (
        <Tag
          value={value.label}
          size="xsmall"
          onRemove={() => {
            setValues(values.filter((needle) => needle.key !== value.key));
          }}
        />
      ))}
      <Select
        plain
        onSearch={(search) => {
          setOptionsFilter(search);
        }}
        onClose={() => setOptionsFilter(undefined)}
        options={filteredOptions}
        name={props.name}
        value={values}
        labelKey={'label'}
        valueKey={'key'}
        icon={false}
        onChange={(event) => {
          const toAdd = props.options.find(
            (option) => option.key === event.value.key
          );
          if (toAdd) {
            const newValues = [...values, toAdd];
            setValues(newValues);
            props.onChange(newValues);
          }
        }}
        valueLabel={() => {
          return <Button label="Add" />;
        }}
      />
    </Box>
  );
};
