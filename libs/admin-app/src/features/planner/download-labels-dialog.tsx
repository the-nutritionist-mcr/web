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
import { DateTime } from 'luxon';
import fileDownload from 'js-file-download';
import { Checkmark } from 'grommet-icons';
import JSZip from 'jszip';
import { FC, useState } from 'react';
import { defaultDeliveryDays } from '@tnmw/config';
import {
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  Recipe,
  Swapped,
  WeeklyCookPlan,
  GetPlanResponseNew,
} from '@tnmw/types';
import generateCookPlanDocumentDefinition from '../../lib/generateCookPlanDocumentDefinition';
import {
  generateMealsCsvFromObjectArray,
  generateIndividualCsv,
} from '../../lib/generateCsvStringFromObjectArray';

import {
  generateLabelData,
  makeCookPlan,
  makeCookPlanV2,
  performSwaps,
} from '@tnmw/meal-planning';
import { fetchData, generateDatestampedFilename } from '@tnmw/utils';
import generateDeliveryPlanDocumentDefinition from '../../lib/generateDeliveryPlanDocumentDefinition';
import generateCookPlanDocumentDefinitionV2 from '../../lib/generateCookPlanDocumentDefinitionV2';
import downloadPdf from '../../lib/downloadPdf';
import { generateAddressDownload } from './generate-address-download';
import { generateCookReport } from '../../lib/generate-cook-report';

interface PlanId {
  sort: string;
  createdOn: Date;
}

interface DownloadLabelsDialogProps {
  onClose: () => void;
  plan: WeeklyCookPlan;
  plansList: PlanId[];
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
  plansList,
  recipes,
  plan: originalPlan,
  customers,
}) => {
  const [cookNumber, setCookNumber] = useState('1');
  const [plan, setPlan] = useState('Current');
  const [useBy, setUseBy] = useState('');
  const cooks = Array.from({ length: defaultDeliveryDays.length }, (_, i) =>
    String(i + 1)
  );

  const getPlan = async () => {
    if (plan === 'Current') {
      return {
        swappedCustomerPlans: originalPlan.customerPlans.map((plan) =>
          performSwaps(plan, plan.customer, recipes)
        ),
        originalPlan,
      };
    }

    const response = await fetchData<GetPlanResponseNew>(`plan/${plan}`);
    if (response.admin) {
      return {
        swappedCustomerPlans: response.plan.customerPlans.map((plan) =>
          performSwaps(plan, plan.customer, recipes)
        ),
        originalPlan: response.plan,
      };
    }

    return { swappedCustomerPlans: [], originalPlan: undefined };
  };

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
          <FormField name="Plan" label="Plan" required width="100%">
            <Select
              labelKey="label"
              valueKey="value"
              options={[
                'Current',
                ...plansList.map((plan) => ({
                  value: plan.sort,
                  label: DateTime.fromJSDate(plan.createdOn).toLocaleString(
                    DateTime.DATETIME_MED
                  ),
                })),
              ]}
              value={plan}
              onChange={({ value }) => {
                setPlan(value.value);
              }}
            />
          </FormField>

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
              onClick={async () => {
                const { swappedCustomerPlans } = await getPlan();
                downloadLabels(
                  swappedCustomerPlans,
                  new Date(useBy),
                  recipes,
                  Number(cookNumber) - 1
                );
              }}
            />
            <Button
              primary
              label="Cook Plan V2"
              onClick={async () => {
                const { originalPlan } = await getPlan();
                if (originalPlan) {
                  const plan = makeCookPlanV2(
                    originalPlan.customerPlans,
                    recipes,
                    originalPlan.cooks
                  );
                  downloadPdf(
                    generateCookPlanDocumentDefinitionV2(plan),
                    generateDatestampedFilename('cook-plan', 'pdf')
                  );
                }
              }}
            />
            <Button
              primary
              label="Cook Plan"
              onClick={async () => {
                const { swappedCustomerPlans } = await getPlan();
                const plan = makeCookPlan(swappedCustomerPlans, recipes);
                downloadPdf(
                  generateCookPlanDocumentDefinition(plan),
                  generateDatestampedFilename('cook-plan', 'pdf')
                );
              }}
            />
            <Button
              primary
              label="Address Data"
              onClick={async () => {
                const { swappedCustomerPlans } = await getPlan();
                const addresses = generateAddressDownload(
                  swappedCustomerPlans,
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
              onClick={async () => {
                const { swappedCustomerPlans } = await getPlan();
                const plan = generateDeliveryPlanDocumentDefinition(
                  swappedCustomerPlans,
                  recipes,
                  originalPlan.cooks
                );
                downloadPdf(
                  plan,
                  generateDatestampedFilename('pack-plan', 'pdf')
                );
              }}
            />

            <Button
              primary
              label="Cook Data Report"
              onClick={async () => {
                const { swappedCustomerPlans } = await getPlan();
                const plan = makeCookPlanV2(
                  originalPlan.customerPlans,
                  recipes,
                  originalPlan.cooks
                );
                const report = generateCookReport(plan, swappedCustomerPlans);

                downloadPdf(
                  report,
                  generateDatestampedFilename('cook-report', 'pdf')
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
