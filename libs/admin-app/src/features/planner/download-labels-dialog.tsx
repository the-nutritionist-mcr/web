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
import fileDownload from 'js-file-download';
import { Checkmark, Close } from 'grommet-icons';
import JSZip from 'jszip';
import { FC, useState } from 'react';
import { defaultDeliveryDays } from '@tnmw/config';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  Recipe,
  Swapped,
  WeeklyCookPlan,
} from '@tnmw/types';
import generateCookPlanDocumentDefinition from '../../lib/generateCookPlanDocumentDefinition';
import {
  generateMealsCsvFromObjectArray,
  generateIndividualCsv,
} from '../../lib/generateCsvStringFromObjectArray';

import {
  generateLabelData,
  makeCookPlan,
  performSwaps,
} from '@tnmw/meal-planning';
import { generateDatestampedFilename } from '@tnmw/utils';
import generateDeliveryPlanDocumentDefinition from '../../lib/generateDeliveryPlanDocumentDefinition';
import downloadPdf from '../../lib/downloadPdf';
import { generateAddressDownload } from './generate-address-download';

interface DownloadLabelsDialogProps {
  onClose: () => void;
  plan: WeeklyCookPlan;
  customers: BackendCustomer[];
  recipes: Recipe[];
}

const downloadLabels = async (
  swappedPlan: Swapped<MealPlanGeneratedForIndividualCustomer>[],
  useBy: Date,
  recipes: Recipe[],
  cook: number
) => {
  const data = generateLabelData(swappedPlan, useBy, recipes, cook);
  const csvData = generateMealsCsvFromObjectArray(data);

  const zip = new JSZip();
  csvData.forEach((csvData) =>
    zip.file(`${csvData.filename}.csv`, csvData.data)
  );
  const file = await zip.generateAsync({ type: 'blob' });
  fileDownload(file, generateDatestampedFilename('labels', 'zip'));
};

export const DownloadLabelsDialog: FC<DownloadLabelsDialogProps> = ({
  onClose,
  recipes,
  plan,
  customers,
}) => {
  const [cookNumber, setCookNumber] = useState('1');
  const [useBy, setUseBy] = useState('');
  const cooks = Array.from({ length: defaultDeliveryDays.length }, (_, i) =>
    String(i + 1)
  );

  const swappedPlan = plan.customerPlans.map((plan) =>
    performSwaps(plan, plan.customer, recipes)
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

          <FormField name="Use By" label="Use By" required width="100%">
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
            style={{ rowGap: '1em', marginTop: '1em' }}
          >
            <Button
              primary
              label="Meal Label Data"
              onClick={() => {
                downloadLabels(
                  swappedPlan,
                  new Date(useBy),
                  recipes,
                  Number(cookNumber) - 1
                );
              }}
            />
            <Button
              primary
              label="Cook Plan"
              onClick={() => {
                const plan = makeCookPlan(swappedPlan, recipes);
                downloadPdf(
                  generateCookPlanDocumentDefinition(plan),
                  generateDatestampedFilename('cook-plan', 'pdf')
                );
              }}
            />
            <Button
              primary
              label="Address Data"
              onClick={() => {
                const addresses = generateAddressDownload(
                  swappedPlan,
                  customers,
                  Number(cookNumber) - 1
                );
                const csvData = generateIndividualCsv(addresses);
                fileDownload(
                  csvData,
                  generateDatestampedFilename('addresses', 'csv')
                );
              }}
            />
            <Button
              primary
              label="Pack Plan"
              onClick={() => {
                const plan = generateDeliveryPlanDocumentDefinition(
                  swappedPlan,
                  recipes
                );
                downloadPdf(
                  plan,
                  generateDatestampedFilename('pack-plan', 'pdf')
                );
              }}
            />
          </Box>
        </CardBody>
        <CardFooter pad="small" alignSelf="center" justify="center">
          <Button
            icon={<Checkmark color="brand" size="small" />}
            label="Close"
            type="submit"
            name="submit"
            onClick={() => {
              onClose();
            }}
          />
        </CardFooter>
      </Card>
    </Layer>
  );
};