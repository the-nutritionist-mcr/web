export const CHARGEBEE = {
  subscriptionStatuses: {
    active: 'active',
    paused: 'paused',
  },
  itemTypes: {
    plan: 'plan',
  },
  customFields: {
    customer: {
      customerProfileNotes: 'cf_customer_profile_notes',
      deliveryDay1: 'cf_cook_1_delivery_day',
      deliveryDay2: 'cf_cook_2_delivery_day',
      deliveryDay3: 'cf_cook_3_delivery_day',
    },
    plan: {
      itemsPerDay: 'cf_items_per_day',
      daysPerWeek: 'cf_days_per_week',
    },
    itemFamily: {
      isExtra: 'cf_extra',
    },
  },
  sites: {
    test: 'thenutritionist-test',
  },
};
