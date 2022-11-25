import { defaultDeliveryDays } from '@tnmw/config';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormField,
  Heading,
  Layer,
  Paragraph,
  Select,
} from 'grommet';
import { useState } from 'react';

interface UpdatePlanRowDialogProps {
  options: string[];
  onUpdate: (option: string, delivery: number) => void;
  onClose: () => void;
}

export const UpdatePlanRowDialog = (props: UpdatePlanRowDialogProps) => {
  const [option, setOption] = useState<string>(props.options[0]);
  const [delivery, setDelivery] = useState('1');
  return (
    <Layer style={{ zIndex: '2000' }}>
      <Card>
        <CardHeader margin="none" pad="medium" alignSelf="center">
          <Heading margin="none" level={3}>
            Add Plan Row
          </Heading>
        </CardHeader>
        <CardBody pad="medium" alignSelf="center">
          <Paragraph margin={{ bottom: '1rem' }}>
            Please note that this does NOT change what the customer is paying,
            it simply allows you to add meals to a customer's delivery that
            aren't part of their normal plan. Use with caution.
          </Paragraph>
          <FormField label="Option">
            <Select
              a11yTitle="Plan Name"
              name="plan"
              options={props.options}
              value={option}
              onChange={(event) => {
                setOption(event.value);
              }}
            />
          </FormField>

          <FormField label="Delivery">
            <Select
              name="delivery"
              options={defaultDeliveryDays.map((item, index) =>
                String(index + 1)
              )}
              value={delivery}
              onChange={(event) => {
                setDelivery(event.value);
              }}
            />
          </FormField>
        </CardBody>
        <CardFooter pad="medium">
          <Button
            label="save"
            onClick={() => props.onUpdate(option, Number(delivery) - 1)}
          />
          <Button label="close" onClick={props.onClose} />
        </CardFooter>
      </Card>
    </Layer>
  );
};
