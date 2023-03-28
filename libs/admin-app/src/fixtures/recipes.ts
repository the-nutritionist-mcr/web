import { HotOrCold, Recipe } from '@tnmw/types';

const nutsExclusion = {
  id: '0',
  name: 'nuts',
  allergen: true,
};

const fishExclusion = {
  id: '1',
  name: 'fish',
  allergen: false,
};

const mustardExclusion = {
  id: '2',
  name: 'mustard',
  allergen: true,
};

const riceExclusion = {
  id: '3',
  name: 'rice',
  allergen: false,
};

const recipes: Recipe[] = [
  {
    id: '0',
    name: 'Stew',
    shortName: '',
    hotOrCold: HotOrCold.Hot,
    potentialExclusions: [nutsExclusion],
  },
  {
    id: '1',
    hotOrCold: HotOrCold.Hot,
    shortName: '',
    name: 'Fish',
    potentialExclusions: [fishExclusion],
  },
  {
    id: '2',
    hotOrCold: HotOrCold.Hot,
    shortName: '',
    name: 'Beef Stroganof',
    potentialExclusions: [],
  },
  {
    id: '3',
    hotOrCold: HotOrCold.Hot,
    shortName: '',
    name: 'Salad',
    potentialExclusions: [nutsExclusion, mustardExclusion],
  },
  {
    id: '4',
    hotOrCold: HotOrCold.Hot,
    shortName: '',
    name: 'Sandwich',
    potentialExclusions: [],
  },
  {
    id: '5',
    shortName: '',
    name: 'Casserole',
    hotOrCold: HotOrCold.Hot,
    potentialExclusions: [mustardExclusion],
  },
  {
    id: '6',
    shortName: '',
    name: 'Risotto',
    hotOrCold: HotOrCold.Hot,
    potentialExclusions: [riceExclusion],
  },
];

export default recipes;
