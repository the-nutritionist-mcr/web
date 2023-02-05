import {
  Layer,
  Card,
  Paragraph,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  FormField,
  Select,
  DateInput,
  Button,
  Box,
} from 'grommet';
import { Checkmark, Close } from 'grommet-icons';
import React, { FC, useState } from 'react';
import { defaultDeliveryDays } from '@tnmw/config';

interface DownloadLabelsDialogProps {
  onClose: () => void;
  onDownload: (useBy: Date, cookIndex: number) => void;
}

const DownloadLabelsDialog: FC<DownloadLabelsDialogProps> = ({
  onClose,
  onDownload,
}) => {
  const [cookNumber, setCookNumber] = useState('1');
  const [useBy, setUseBy] = useState('');
  const cooks = Array.from({ length: defaultDeliveryDays.length }, (_, i) =>
    String(i + 1)
  );
  return (
    <Layer>
      <Card>
        <CardHeader margin="none" pad="medium">
          <Heading level={3} margin="none">
            Downloads
          </Heading>
        </CardHeader>
        <CardBody
          margin="none"
          pad="medium"
          gap="medium"
          align="center"
          width="400px"
        >
          <FormField name="Which Cook" label="Which Cook" required width="100%">
            <Select
              options={cooks}
              value={String(cookNumber)}
              onChange={({ option }) => setCookNumber(option)}
            />
          </FormField>

          <FormField name="Use By" label="Use By" required>
            <DateInput
              format="mm/dd/yyyy"
              value={useBy}
              onChange={({ value }) => !Array.isArray(value) && setUseBy(value)}
            />
          </FormField>

          <Paragraph>
            The use by date will appear on each label and should be set to 3
            days after the date the cook will be taking place
          </Paragraph>

          <Box
            gap="small"
            direction="row"
            justify="center"
            wrap
            style={{ rowGap: '1em' }}
          >
            <Button primary label="Meal Label Data" />
            <Button primary label="Cook Plan" />
            <Button primary label="Address Data" />
            <Button primary label="Pack Plan" />
          </Box>
        </CardBody>
        <CardFooter pad="small" alignSelf="center" justify="center">
          <Button
            icon={<Checkmark color="brand" size="small" />}
            label="Ok"
            type="submit"
            name="submit"
            onClick={() => {
              onDownload(new Date(useBy), Number.parseInt(cookNumber, 10) - 1);
            }}
          />
          <Button
            icon={<Close color="brand" size="small" />}
            onClick={onClose}
            label="Cancel"
          />
        </CardFooter>
      </Card>
    </Layer>
  );
};

export default DownloadLabelsDialog;
