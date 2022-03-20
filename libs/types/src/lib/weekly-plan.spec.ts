import { isWeeklyPlan } from './weekly-plan';

describe('is weekly plan', () => {
  it('should correctly identify a plan payload as a weekly plan', () => {
    const plan = JSON.parse(`
{
  "cooks": [
    [
      {
        "hotOrCold": "Hot",
        "shortName": "soup",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "Nothing",
        "id": "62f141f6-fd39-40f9-8d4c-f1f355dcd0ab",
        "name": "A delicous soup"
      },
      {
        "hotOrCold": "Hot",
        "shortName": "chix",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "Some lovely chicken",
        "id": "13a0eec3-167a-45f6-b461-8e7b6fa25544",
        "name": "Chicken"
      }
    ],
    [
      {
        "hotOrCold": "Hot",
        "shortName": "fish",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "Yum, fish",
        "id": "9007563b-a877-47f8-916d-fba6f090850d",
        "name": "Fish"
      },
      {
        "hotOrCold": "Hot",
        "shortName": "sand",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "Some sandy sandwich",
        "id": "3d85877b-47b2-4205-903c-ab3d9e5435b0",
        "name": "Sandwich"
      }
    ],
    [
      {
        "hotOrCold": "Hot",
        "shortName": "pizza",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "Too many calories",
        "id": "edd1f8fb-6c41-4c01-abb7-b9857dd1f2c5",
        "name": "pizza"
      },
      {
        "hotOrCold": "Hot",
        "shortName": "ragu",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "A meaty ragu",
        "id": "060a0fc7-ac60-4199-896e-95a3ec0442a1",
        "name": "ragu"
      }
    ]
  ],
  "dates": [
    "2022-03-20T00:00:00.000Z",
    "2022-03-15T00:00:00.000Z",
    "2022-03-18T00:00:00.000Z"
  ]
}`);

    const result = isWeeklyPlan(plan);

    expect(result).toBeTruthy();
  });
});
