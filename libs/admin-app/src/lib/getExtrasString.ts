import Customer, { Snack } from "../domain/Customer";

const getExtrasString = (customer: Customer): string => {
  const returnVal = [];

  if (customer.breakfast) {
    returnVal.push("Breakfast");
  }

  if (customer.snack !== Snack.None) {
    returnVal.push(`${customer.snack} Snack`);
  }

  return returnVal.length > 0 ? returnVal.join(", ") : "None";
};

export default getExtrasString;
