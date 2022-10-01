import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  TextInput,
  Heading,
  FormField,
  Layer,
  Card,
} from 'grommet';
import { Checkmark, Close } from 'grommet-icons';
import { useState } from 'react';
import randomString from 'randomstring';

interface ResetPasswordDialogProps {
  onCancel: () => void;
  onSubmit: (newPassword: string) => void;
}

export const ResetPasswordDialog = (props: ResetPasswordDialogProps) => {
  const [password, setPassword] = useState(randomString.generate(8));

  return (
    <Layer>
      <Card>
        <CardHeader margin="none" pad="medium" alignSelf="center">
          <Heading margin="none" level={2}>
            Reset Customer Password
          </Heading>
        </CardHeader>
        <CardBody pad="medium" alignSelf="center">
          <FormField>
            <TextInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormField>
        </CardBody>
        <CardFooter pad="medium" alignSelf="center" justify="center">
          <Button
            icon={<Checkmark color="brand" size="small" />}
            label="Ok"
            onClick={() => {
              props.onSubmit(password);
            }}
          />
          <Button
            icon={<Close color="brand" size="small" />}
            onClick={props.onCancel}
            label="Cancel"
          />
        </CardFooter>
      </Card>
    </Layer>
  );
};
