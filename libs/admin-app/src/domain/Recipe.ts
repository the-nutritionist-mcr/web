import Exclusion from './Exclusion';

export enum HotOrCold {
  Hot = 'Hot',
  Cold = 'Cold',
  Both = 'Both',
}

export default interface Recipe {
  id: string;
  name: string;
  shortName: string;
  hotOrCold: HotOrCold;
  description?: string;
  potentialExclusions: Exclusion[];
  invalidExclusions?: string[];
  createdAt?: string;
  updatedAt?: string;
}
