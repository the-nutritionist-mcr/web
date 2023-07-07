import { Heading, Header, Button } from 'grommet';
import { AddAdHocRowDialog } from './add-ad-hoc-row-dialog';

import React, { useState } from 'react';
import Finalize from './Finalize';
import {
  Recipe,
  WeeklyCookPlan,
  MealPlanGeneratedForIndividualCustomer,
  BackendCustomer,
  Exclusion,
} from '@tnmw/types';
import { DownloadLabelsDialog } from './download-labels-dialog';

interface PlannerProps {
  createdBy: string;
  creationDate: Date;
  plan: WeeklyCookPlan;
  plansList: PlanId[];
  customers: BackendCustomer[];
  customisations: Exclusion[];
  recipes: Recipe[];
  update: (item: MealPlanGeneratedForIndividualCustomer) => Promise<void>;
  publish: () => Promise<void>;
  published: boolean;
}

interface PlanId {
  sort: string;
  createdOn: Date;
}

const Planner: React.FC<PlannerProps> = (props) => {
  const recipes = props.recipes;
  const [showLabelsDialog, setShowLabelDialog] = useState(false);
  const [showAdhocDialog, setShowAdhocDialog] = useState(false);

  const customerMeals = props.published && props.plan;

  return (
    <>
      {showLabelsDialog && (
        <DownloadLabelsDialog
          onClose={() => setShowLabelDialog(false)}
          recipes={recipes}
          customers={props.customers}
          plan={props.plan}
          plansList={props.plansList}
        />
      )}
      {showAdhocDialog && (
        <AddAdHocRowDialog
          customisations={props.customisations}
          onOk={async (plan) => {
            await props.update(plan);
            return setShowAdhocDialog(false);
          }}
          onCancel={() => setShowAdhocDialog(false)}
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
          label="Add Ad-hoc Customer"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            setShowAdhocDialog(true);
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
