import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  Heading,
  Layer
} from 'grommet';

import { Checkmark, Close } from 'grommet-icons';
import React from 'react';
import assertFC from '../../lib/assertFC';
import { debounce } from 'lodash';

interface OkCancelDialogProps<T = undefined> {
  thing?: T;
  show?: boolean;
  header: string;
  onOk: (thing: T | undefined) => void;
  onChange?: (value: unknown) => void;
  onCancel: () => void;
}

const ON_SUBMIT_DEBOUNCE = 500;

function OkCancelDialogContainer<T>(
  props: React.PropsWithChildren<OkCancelDialogProps<T>>
): React.ReactElement | null {
  const thingValue = props.thing ? { ...props.thing } : props.thing;
  const [thing, setThing] = React.useState<T | undefined>(thingValue);
  const onSubmit = debounce(async (): Promise<void> => {
    props.onOk(thing);
  }, ON_SUBMIT_DEBOUNCE);
  const contents = (
    <React.Fragment>
      <CardHeader margin="none" pad="medium" alignSelf="center">
        <Heading margin="none" level={2}>
          {props.header}
        </Heading>
      </CardHeader>
      <CardBody pad="medium" alignSelf="center">
        {props.children}
      </CardBody>
      <CardFooter pad="medium" alignSelf="center" justify="center">
        <Button
          type={props.thing ? 'submit' : undefined}
          icon={<Checkmark color="brand" size="small" />}
          label="Ok"
          onClick={props.thing ? undefined : () => props.onOk(thing)}
        />
        <Button
          icon={<Close color="brand" size="small" />}
          onClick={(): void => {
            setThing(thingValue);
            props.onCancel();
          }}
          label="Cancel"
        />
      </CardFooter>
    </React.Fragment>
  );
  const dialogWithOrWithoutForm = props.thing ? (
    <Form
      value={thing}
      onSubmit={onSubmit}
      onChange={(nextData: unknown): void => {
        setThing(nextData as T);
        props.onChange?.(nextData);
      }}
    >
      {contents}
    </Form>
  ) : (
    contents
  );

  return (
    <Layer>
      <Card>{dialogWithOrWithoutForm}</Card>
    </Layer>
  );
}

function OkCancelDialog<T>(
  props: React.PropsWithChildren<OkCancelDialogProps<T>>
): React.ReactElement | null {
  // eslint-disable-next-line unicorn/no-null
  return props?.show ? <OkCancelDialogContainer {...props} /> : null;
}

assertFC(OkCancelDialog);
assertFC(OkCancelDialogContainer);

export default OkCancelDialog;
