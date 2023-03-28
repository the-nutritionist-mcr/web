import {
  Button,
  Header,
  Heading,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'grommet';
import EditExclusionDialog from './EditExclusionDialog';
import ExclusionRow from './ExclusionRow';
import React, { Dispatch, SetStateAction } from 'react';
import { Exclusion } from '@tnmw/types';
import { PAGE_SIZE } from '@tnmw/constants';
import { useRouter } from 'next/router';
import { BeatLoader } from 'react-spinners';

interface ExclusionsProps {
  exclusions?: Exclusion[];
  create: (newExclusion: Exclusion) => Promise<void>;
  remove: (exclusionToRemove: Exclusion) => Promise<void>;
  update: (exclusionToUpdate: Exclusion) => Promise<void>;
  setPage: Dispatch<SetStateAction<number>>;
  totalCount: number;
}

const Exclusions: React.FC<ExclusionsProps> = (props) => {
  const exclusions = props.exclusions ?? [];
  const [showCreate, setShowCreate] = React.useState(false);

  const router = useRouter();

  return (
    <React.Fragment>
      <Header
        align="center"
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        <Heading level={2}>Customisations</Heading>
        <Button
          primary
          size="small"
          label="New"
          a11yTitle="New Customer"
          onClick={(): void => {
            setShowCreate(true);
          }}
        />
        <Pagination
          numberItems={props.totalCount}
          step={PAGE_SIZE}
          onChange={({ page }) => {
            // eslint-disable-next-line fp/no-mutating-methods
            props.setPage(page);

            // eslint-disable-next-line fp/no-mutating-methods
            router.push(
              {
                pathname: `/admin/customisations/`,
                query: {
                  page,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
        />
        <EditExclusionDialog
          exclusion={{
            id: '0',
            name: '',
            allergen: false,
          }}
          show={showCreate}
          title="Create Customisation"
          onOk={(thing: Exclusion | undefined) => {
            setShowCreate(false);
            thing && props.create(thing);
          }}
          onCancel={(): void => {
            setShowCreate(false);
          }}
        />
      </Header>
      <Table alignSelf="start" style={{ tableLayout: 'fixed' }}>
        <TableHeader>
          <TableRow>
            <TableCell scope="col">
              <strong>Name</strong>
            </TableCell>
            <TableCell scope="col">
              <strong>Allergen</strong>
            </TableCell>
            <TableCell scope="col" style={{ textAlign: 'right' }}>
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exclusions.length > 0 ? (
            // eslint-disable-next-line fp/no-mutating-methods
            exclusions
              .slice()
              .sort((a, b) => (a.name > b.name ? -1 : 1))
              .reverse()
              .map((exclusion) => (
                <ExclusionRow
                  key={exclusion.id}
                  exclusion={exclusion}
                  remove={props.remove}
                  update={props.update}
                />
              ))
          ) : (
            <TableRow>
              <TableCell
                scope="row"
                colSpan={3}
                style={{ textAlign: 'center', paddingTop: '1rem' }}
              >
                <BeatLoader cssOverride={{ margin: '1rem auto' }} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default Exclusions;
