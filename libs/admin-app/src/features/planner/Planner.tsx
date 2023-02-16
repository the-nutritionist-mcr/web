import { Heading, Header, Button } from 'grommet';
import JSZip from 'jszip';

import React, { useState } from 'react';
import Finalize from './Finalize';
import {
  Recipe,
  WeeklyCookPlan,
  MealPlanGeneratedForIndividualCustomer,
  BackendCustomer,
} from '@tnmw/types';
import { DownloadLabelsDialog } from './download-labels-dialog';
import { v4 } from 'uuid';

interface PlannerProps {
  createdBy: string;
  creationDate: Date;
  plan: WeeklyCookPlan;
  customers: BackendCustomer[];
  recipes: Recipe[];
  update: (item: MealPlanGeneratedForIndividualCustomer) => Promise<void>;
  publish: () => Promise<void>;
  published: boolean;
}

const Planner: React.FC<PlannerProps> = (props) => {
  const recipes = props.recipes;
  const [showLabelsDialog, setShowLabelDialog] = useState(false);

  const customerMeals = props.published && props.plan;

  return (
    <>
      {showLabelsDialog && (
        <DownloadLabelsDialog
          onClose={() => setShowLabelDialog(false)}
          recipes={recipes}
          customers={props.customers}
          plan={props.plan}
        />
      )}
      <Header
        align="center"
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        <Heading level={2}>Planner</Heading>

        <Button
          primary
          size="small"
          label="Downloads"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            setShowLabelDialog(true);
          }}
        />

        <Button
          primary
          size="small"
          label="Add Hoc Row"
          onClick={() => {
            props.update({
              wasUpdatedByCustomer: false,
              deliveries: [
                {
                  dateCooked: new Date(),
                  plans: [],
                },
                {
                  dateCooked: new Date(),
                  plans: [],
                },
              ],
              customer: {
                groups: [],
                username: v4(),
                country: '',
                deliveryDay1: '',
                deliveryDay2: '',
                deliveryDay3: '',
                customerUpdateTime: '',
                deliveryNotes: '',
                addressLine1: '',
                addressLine2: '',
                phoneNumber: '',
                addressLine3: '',
                subscriptionUpdateTime: '',
                firstName: 'Ad Hoc2',
                surname: 'Customer',
                salutation: '',
                email: '',
                city: '',
                postcode: '',
                plans: [
                  {
                    termEnd: 0,
                    subscriptionStatus: 'active',
                    id: '1',
                    name: 'Dummy',
                    daysPerWeek: 0,
                    itemsPerDay: 0,
                    isExtra: false,
                    totalMeals: 0,
                  },
                ],
                customisations: [],
              },
            });
          }}
        />

        {!props.published && (
          <Button
            primary
            size="small"
            label="Publish"
            onClick={props.publish}
          />
        )}
      </Header>
      {props.plan && (
        <Finalize
          cooks={props.plan.cooks}
          published={props.published}
          recipes={props.recipes}
          customerMeals={props.plan.customerPlans}
          update={props.update}
          creationDate={props.creationDate}
          generatedBy={props.createdBy}
          customers={props.customers}
        />
      )}
    </>
  );
};

export default Planner;
