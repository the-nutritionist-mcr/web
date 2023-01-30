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
  Paragraph,
  CheckBox,
} from 'grommet';
import { Checkmark, Close } from 'grommet-icons';
import { useState } from 'react';
import randomString from 'randomstring';

interface ResetPasswordDialogProps {
  onCancel: () => void;
  onSubmit: (newPassword: string, forceChange: boolean) => void;
}

export const ResetPasswordDialog = (props: ResetPasswordDialogProps) => {
  const [password, setPassword] = useState(randomString.generate(8));
  const [forceChange, setForcechange] = useState(true);

  return (
    <Layer>
      <Card>
        <CardHeader margin="none" pad="medium" alignSelf="center">
          <Heading margin="none" level={2}>
            Reset Customer Password
          </Heading>
        </CardHeader>
        <CardBody pad="medium" alignSelf="center" gap="medium">
          <Paragraph margin={{ bottom: 'medium', left: 'small' }}>
            When you click OK, the customer's password will be reset as show in
            the box below.
          </Paragraph>
          <Paragraph margin={{ bottom: 'medium', left: 'small' }}>
            The customer will receive a welcome email containing the new
            password. When they attempt to log in, they will be required to
            change to a password that they can remember.
          </Paragraph>
          <FormField>
            <TextInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              name="password"
            />
          </FormField>
          <CheckBox
            checked={forceChange}
            name="force"
            label="Force Change Password?"
            onChange={(event) => setForcechange(event.target.checked)}
          />
        </CardBody>
        <CardFooter pad="medium" alignSelf="center" justify="center">
          <Button
            icon={<Checkmark color="brand" size="small" />}
            label="Ok"
            onClick={() => {
              props.onSubmit(password, forceChange);
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
