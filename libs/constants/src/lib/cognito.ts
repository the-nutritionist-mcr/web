export const COGNITO = {
  customAttributes: {
    ChargebeeId: 'chargebeeId',
    UserCustomisations: 'userCustomisations',
    DeliveryDay1: 'deliveryDay1',
    DeliveryDay2: 'deliveryDay2',
    DeliveryDay3: 'deliveryDay3',
    ProfileNotes: 'profileNotes',
    Plans: 'plans',
    AddressLine1: 'addressLine1',
    AddressLine2: 'addressLine2',
    AddressLine3: 'addressLine3',
    City: 'city',
    Postcode: 'postcode',
    Country: 'country',
    CustomerUpdateTimestamp: 'cxUpdateTime',
    SubscriptionUpdateTimestamp: 'subUpdateTime',
  },

  standardAttributes: {
    email: 'email',
    emailVerified: 'email_verified',
    surname: 'family_name',
    firstName: 'given_name',
    phone: 'phone_number',
  },
} as const;
