import {
  Box,
  DateInput,
  FormField,
  Paragraph,
  Text,
  ThemeContext,
} from "grommet";
import Customer from "../../domain/Customer";
import { OkCancelDialog } from "..";
import React from "react";
import calendarFormat from "../../lib/calendarFormat";
import moment from "moment";
import { updateCustomer } from "../../features/customers/customersSlice";

interface PauseDialogProps {
  show: boolean;
  customer: Customer;
  onOk: () => void;
  onCancel: () => void;
}

const HUNDRED_YEARS_IN_FUTURE = 100;

const PauseDialog: React.FC<PauseDialogProps> = (props) => {
  const [pauseStart, setPauseStart] = React.useState<string | undefined>(
    props.customer.pauseStart
  );
  const [pauseEnd, setPauseEnd] = React.useState<string | undefined>(
    props.customer.pauseEnd
  );

  const pauseStartToShow = pauseStart ?? props.customer.pauseStart;
  const pauseEndToShow = pauseEnd ?? props.customer.pauseEnd;

  const todayIso = new Date(Date.now()).toISOString();
  const pauseEndStartBound = pauseStart ?? todayIso;
  const hundredYearsFromNow = new Date(Date.now());
  hundredYearsFromNow.setFullYear(
    new Date(Date.now()).getFullYear() + HUNDRED_YEARS_IN_FUTURE
  );

  const friendlyStart = pauseStartToShow
    ? `from ${moment(new Date(pauseStartToShow)).calendar(
        null,
        calendarFormat
      )}`
    : "No pause start";

  const friendlyEnd = pauseEndToShow
    ? `until ${moment(new Date(pauseEndToShow)).calendar(null, calendarFormat)}`
    : "No pause end";

  return (
    <OkCancelDialog
      thing={props.customer}
      thunk={updateCustomer}
      show={props.show}
      header="Add Pause"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={(data: any) => {
        setPauseStart(data.pauseStart);
        setPauseEnd(data.pauseEnd);
      }}
      onOk={(): void => {
        setPauseStart(undefined);
        setPauseEnd(undefined);
        props.onOk();
      }}
      onCancel={props.onCancel}
    >
      <ThemeContext.Extend
        value={{ global: { control: { border: { width: "0" } } } }}
      >
        <Paragraph margin="none" textAlign="center">
          Use the calendars below to choose a pause start and end date. To pause
          a customer indefinitely, select a start date only.
        </Paragraph>
        <Box direction="row" gap="medium" margin="medium" alignSelf="center">
          <Box direction="column" gap="small" a11yTitle="Start Pause">
            <FormField name="pauseStart">
              <DateInput
                inline={true}
                defaultValue={todayIso}
                name="pauseStart"
                calendarProps={{
                  a11yTitle: "Start Pause",
                  size: "small",
                  daysOfWeek: true
                }}
              />
              <Box pad={{ top: "small" }}>
                <Text a11yTitle="Selected start date" alignSelf="center">
                  <strong>{friendlyStart}</strong>
                </Text>
              </Box>
            </FormField>
          </Box>
          <Box direction="column" gap="small" a11yTitle="End Pause">
            <FormField name="pauseEnd">
              <DateInput
                inline={true}
                name="pauseEnd"
                calendarProps={{
                  a11yTitle: "End Pause",
                  daysOfWeek: true,
                  size: "small",
                  bounds: [
                    pauseEndStartBound,
                    hundredYearsFromNow.toISOString(),
                  ],
                }}
              />
              <Box pad={{ top: "small" }}>
                <Text alignSelf="center" a11yTitle="Selected end date">
                  <strong>{friendlyEnd}</strong>
                </Text>
              </Box>
            </FormField>
          </Box>
        </Box>
      </ThemeContext.Extend>
    </OkCancelDialog>
  );
};

export default PauseDialog;
