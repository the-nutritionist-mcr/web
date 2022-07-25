import { isWeeklyPlan } from './weekly-plan';

describe('is weekly plan', () => {
  it('should correclty identify another plan as a weekly plan', () => {
    const plan = JSON.parse(`
{
  "timestamp": 1658782032018,
  "cooks": [
    [
      {
        "hotOrCold": "Hot",
        "shortName": "foo",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "bar",
        "id": "86d807d8-e4fd-4c09-ae6d-e801e66cc252",
        "name": "test"
      }
    ],
    [
      {
        "hotOrCold": "Hot",
        "shortName": "foo",
        "potentialExclusions": [],
        "invalidExclusions": [],
        "description": "bar",
        "id": "86d807d8-e4fd-4c09-ae6d-e801e66cc252",
        "name": "test"
      }
    ]
  ],
  "dates": [
    "2022-07-04T23:00:00.000Z",
    "2022-06-29T23:00:00.000Z"
  ]
}`);
    const result = isWeeklyPlan(plan);

    expect(result).toBeTruthy();
  });
  it('should correctly identify a plan payload as a weekly plan', () => {
    const plan = JSON.parse(`
{
  "timestamp": 1658782032018,
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

  it('should correctly identify a plan payload as a weekly plan', () => {
    const plan = JSON.parse(`
    {
      "timestamp": 1658782032018,
      "cooks":[
         [
            {
               "hotOrCold":"Hot",
               "shortName":"7 SPICE CHIX",
               "potentialExclusions":[
                  {
                     "name":"Fish",
                     "allergen":false,
                     "id":"f7edc071-cbe4-4165-8937-2bc7540c675b"
                  }
               ],
               "invalidExclusions":[
                  "6fc2efef-56b6-4f71-b720-d9bb70fdfad4"
               ],
               "description":"Levantine style roast potatoes with onions + coriander, autumn greens, toasted almonds, tahini lemon yogurt",
               "id":"ebab65fe-0b19-4342-91e2-4f8820a9bb0b",
               "name":"7 SPICE ROAST CHICKEN"
            },
            {
               "hotOrCold":"Cold",
               "shortName":"GOAT NUT SAL",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"Wholegrain pasta, mixed leaves, blueberries, toasted walnuts, balsamic",
               "id":"510f034d-2fd0-44f0-ae7a-c717aa4594dc",
               "name":"AUTUMN SALAD OF FRENCH GOATS’ CHEESE [V]"
            },
            {
               "hotOrCold":"Hot",
               "shortName":"RICOTTA",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"Wholegrain pasta, steamed broccoli, tomato + basil sauce, aged parmesan, nutmeg",
               "id":"c87560f7-121e-4487-8532-bfdbb1615502",
               "name":"BABY SPINACH + RICOTTA GRATIN"
            }
         ],
         [
            {
               "hotOrCold":"Hot",
               "shortName":"FEN CHIX",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"White basmati rice, sautéed spring greens, grand padano, red amaranth",
               "id":"ce754d01-8a94-4f3c-9336-90b4ad212eae",
               "name":"BRAISED CHICKEN + FLORENCE FENNEL"
            },
            {
               "hotOrCold":"Hot",
               "shortName":"CHORIZO STEW",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"Roast chicken, wholegrain pasta, steamed broccoli, soft herbs",
               "id":"ab3901b1-218c-4b90-9779-2983143fa438",
               "name":"BRAISED CHICKPEAS + CHORIZO IBERICO"
            },
            {
               "hotOrCold":"Hot",
               "shortName":"TOM RISSO",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"Pan seared halloumi, semi dried tomatoes, pistachios, pea shoots, lemon zest",
               "id":"7921c018-8907-4de3-98c7-b23b7d5cdf25",
               "name":"BRIGHT TOMATO + BASIL RISOTTO"
            }
         ],
         [
            {
               "hotOrCold":"Hot",
               "shortName":"TOM RISSO",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"Pan seared halloumi, semi dried tomatoes, pistachios, pea shoots, lemon zest",
               "id":"7921c018-8907-4de3-98c7-b23b7d5cdf25",
               "name":"BRIGHT TOMATO + BASIL RISOTTO"
            },
            {
               "hotOrCold":"Hot",
               "shortName":"BUDDHA BOWL",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"Steamed rice, garlicky courgettes, roasted cauliflower, seared halloumi, turmeric cashew cream dressing",
               "id":"ddb881f9-809c-42b6-b686-89f921623a8f",
               "name":"BUDDHA BOWL"
            },
            {
               "hotOrCold":"Hot",
               "shortName":"BNUT MASS",
               "potentialExclusions":[
                  
               ],
               "invalidExclusions":[
                  
               ],
               "description":"Steamed rice, steamed broccoli, coriander, mint, toasted cashews, black sesame",
               "id":"b6e7bdbc-cd99-4d78-813f-762129ee7390",
               "name":"BUTTERNUT MASSAMAN"
            }
         ]
      ],
      "dates":[
         "2022-05-15T23:00:00.000Z",
         "2022-05-16T23:00:00.000Z",
         "2022-05-18T23:00:00.000Z"
      ]
   }
`);

    const result = isWeeklyPlan(plan);

    expect(result).toBeTruthy();
  });
});
