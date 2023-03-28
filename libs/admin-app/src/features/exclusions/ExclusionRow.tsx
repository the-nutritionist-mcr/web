import { Button, TableCell, TableRow } from 'grommet';
import { Edit, Trash } from 'grommet-icons';
import EditExclusionDialog from './EditExclusionDialog';
import { Exclusion } from '@tnmw/types';
import { OkCancelDialog } from '../../components';
import React from 'react';
import styled from 'styled-components';

interface ExclusionRowProps {
  remove: (exclusionToRemove: Exclusion) => Promise<void>;
  update: (exclusionToUpdate: Exclusion) => Promise<void>;
  exclusion: Exclusion;
}

const SlimButton = styled(Button)`
  padding: 0 5px 0 5px;
`;

const ExclusionRow: React.FC<ExclusionRowProps> = (props) => {
  const [showDoDelete, setShowDoDelete] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  return (
    <TableRow>
      <TableCell scope="row">{props.exclusion.name}</TableCell>
      <TableCell scope="row">
        {props.exclusion.allergen ? 'Yes' : 'No'}
      </TableCell>
      <TableCell
        scope="row"
        style={{
          textAlign: 'right',
          whiteSpace: 'nowrap',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <SlimButton
          secondary
          onClick={(): void => setShowDoDelete(true)}
          a11yTitle="Delete"
          icon={<Trash color="light-6" />}
        />
        <OkCancelDialog
          show={showDoDelete}
          header="Are you sure?"
          thing={props.exclusion}
          onOk={() => {
            setShowDoDelete(false);
            props.remove(props.exclusion);
          }}
          onCancel={(): void => setShowDoDelete(false)}
        >
          Are you sure you want to delete this customisation?
        </OkCancelDialog>

        <SlimButton
          secondary
          onClick={(): void => setShowEdit(true)}
          a11yTitle="Edit"
          icon={<Edit color="light-6" />}
        />
        <EditExclusionDialog
          exclusion={props.exclusion}
          title="Edit Customisation"
          onOk={(newExclusion: Exclusion | undefined): void => {
            setShowEdit(false);
            if (newExclusion) {
              props.update(newExclusion);
            }
          }}
          show={showEdit}
          onCancel={(): void => {
            setShowEdit(false);
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default ExclusionRow;
