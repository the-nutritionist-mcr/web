import { Exclusion } from '@tnmw/types';
import { Tag, Box } from 'grommet';
import { container, noPlan } from './customisations-cell.css';

interface CustomisationsCellProps {
  customisations: Exclusion[];
  keyPrefix: string;
}
export const CustomisationsCell = (props: CustomisationsCellProps) => {
  if (props.customisations.length === 0) {
    return <span className={noPlan}>None</span>;
  }

  return (
    <div className={container}>
      {(props.customisations ?? []).map((customisation) => (
        <Tag
          key={`${props.keyPrefix}-customisations-pill-${customisation.id}`}
          value={customisation.name}
          size="xsmall"
        />
      ))}
    </div>
  );
};
