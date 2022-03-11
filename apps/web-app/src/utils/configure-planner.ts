import { CookDay, MealPlanner } from "@tnmw/planner"

const cook1 = new CookDay({
  dayofweek: "Sunday",
  eatingdayscovered: ["Sunday", "Monday"]
})

const cook2 = new CookDay({
  dayofweek: "Tuesday",
  eatingdayscovered: ["Tuesday", "Wednesday", "Thursday"]
})

const cook3 = new CookDay({
  dayofweek: "Friday",
  eatingdayscovered: ["Friday", "Saturday", "Sunday"]
})



export const planner = new MealPlanner([cook1, cook2, cook3])
