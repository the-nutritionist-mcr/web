const listCustomersQuery = `
query ListCustomersQuery {
  listCustomers {
    exclusions {
      allergen
      id
      name
    }
    address
    breakfast
    daysPerWeek
    email
    firstName
    id
    legacyPrice
    notes
    pauseEnd
    pauseStart
    paymentDayOfMonth
    newPlan {
      deliveries {
        items {
          name
          quantity
        }
        extras {
          name
          quantity
        }
      }
      configuration {
        planType
        daysPerWeek
        mealsPerDay
        totalPlans
        deliveryDays
        extrasChosen
      }
    }
    plan {
      costPerMeal
      category
      name
      mealsPerDay
    }
    salutation
    snack
    startDate
    surname
    telephone
  }
}
`;

export default listCustomersQuery;
