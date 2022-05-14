import { Box, FormField, Select, TextInput } from 'grommet';
import { Exclusion } from '@tnmw/types';
import React from 'react';
import styled from 'styled-components';

const StyledFormField = styled(FormField)`
  width: 300px;
`;

interface EditCustomerDetailsPanelProps {
  exclusions: Exclusion[];
}

const EditCustomerDetailsPanel: React.FC<EditCustomerDetailsPanelProps> = ({
  exclusions,
}) => (
  <>
    <Box direction="row" wrap={true} gap="3rem">
      <StyledFormField name="salutation" label="Salutation">
        <Select
          disabled
          options={[
            'Mr',
            'Mrs',
            'Miss',
            'Ms',
            'Mx',
            'Master',
            'Dr',
            'Prof',
            'Other',
          ]}
          name="salutation"
        />
      </StyledFormField>
      <StyledFormField name="firstName" label="First Name">
        <TextInput disabled name="firstName" />
      </StyledFormField>

      <StyledFormField name="surname" label="Surname">
        <TextInput disabled name="surname" />
      </StyledFormField>

      <StyledFormField name="telephone" label="Telephone">
        <TextInput disabled name="telephone" type="tel" />
      </StyledFormField>
      <StyledFormField name="email" label="Email">
        <TextInput disabled name="email" type="email" />
      </StyledFormField>
      <FormField name="customisations" label="Customisations">
        <Select
          multiple
          closeOnChange={false}
          name="customisations"
          options={exclusions}
          labelKey="name"
          valueKey="name"
        />
      </FormField>
    </Box>
  </>
);

export default EditCustomerDetailsPanel;
