import { CheckBox, FormField, TextInput } from "grommet";
import { ApiRequestFunction } from "../../lib/apiRequestCreator";
import Exclusion from "../../domain/Exclusion";
import { OkCancelDialog } from "../../components";
import React from "react";

interface EditExclusionDialogProps {
  exclusion: Exclusion;
  // eslint-disable-next-line @typescript-eslint/ban-types
  thunk: ApiRequestFunction<Exclusion>;
  onOk: () => void;
  title: string;
  onCancel: () => void;
  show: boolean;
}

const EditExclusionDialog: React.FC<EditExclusionDialogProps> = (props) => {
  return (
    <OkCancelDialog
      show={props.show}
      header={props.title}
      onOk={props.onOk}
      onCancel={props.onCancel}
      thing={props.exclusion}
      thunk={props.thunk}
    >
      <FormField name="name" label="Name" required>
        <TextInput name="name" />
      </FormField>
      <FormField name="allergen" label="Allergen">
        <CheckBox name="allergen" />
      </FormField>
    </OkCancelDialog>
  );
};

export default EditExclusionDialog;
