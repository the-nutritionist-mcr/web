import {
  Box,
  DateInput,
  FormField,
  Select,
  TextArea,
  TextInput,
  ThemeContext,
} from "grommet";
import React from "react";
import styled from "styled-components";

const StyledFormField = styled(FormField)`
  width: 300px;
`;

const EditCustomerDetailsPanel: React.FC = () => (
  <>
    <Box direction="row" wrap={true} gap="3rem">
      <StyledFormField name="salutation" label="Salutation" required>
        <Select
          options={[
            "Mr",
            "Mrs",
            "Miss",
            "Ms",
            "Mx",
            "Master",
            "Dr",
            "Prof",
            "Other",
          ]}
          name="salutation"
        />
      </StyledFormField>
      <StyledFormField name="firstName" label="First Name" required>
        <TextInput name="firstName" />
      </StyledFormField>

      <StyledFormField name="surname" label="Surname" required>
        <TextInput name="surname" />
      </StyledFormField>

      <StyledFormField name="paymentDayOfMonth" label="Payment Day ">
        <TextInput name="paymentDayOfMonth" type="number" />
      </StyledFormField>
      <StyledFormField name="startDate" label="Start Date">
        <DateInput name="startDate" format="dd/mm/yyyy" />
      </StyledFormField>
      <StyledFormField name="telephone" label="Telephone">
        <TextInput name="telephone" type="tel" />
      </StyledFormField>
      <StyledFormField name="email" label="Email" required>
        <TextInput name="email" type="email" />
      </StyledFormField>
    </Box>

    <Box direction="row" fill="horizontal" justify="stretch">
      <ThemeContext.Extend
        value={{
          formField: {
            extend: `
                    flex-grow: 2
                    `,
          },
        }}
      >
        <StyledFormField
          name="address"
          label="Address"
          contentProps={{ fill: true }}
          required
        >
          <TextArea fill={true} name="address" />
        </StyledFormField>
      </ThemeContext.Extend>
    </Box>

    <Box direction="row" fill="horizontal" justify="stretch">
      <ThemeContext.Extend
        value={{
          formField: {
            extend: `
                    flex-grow: 2
                    `,
          },
        }}
      >
        <StyledFormField
          name="notes"
          label="Notes"
          contentProps={{ fill: true }}
        >
          <TextArea fill={true} name="notes" />
        </StyledFormField>
      </ThemeContext.Extend>
    </Box>
  </>
);

export default EditCustomerDetailsPanel;
