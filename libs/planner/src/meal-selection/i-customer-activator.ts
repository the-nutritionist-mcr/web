import { Customer, ICookDay } from '../entities';
import { ImmutableDate } from '../utils';

export interface ICustomerActivator {
  active: (
    customer: Customer,
    cookDay: ICookDay,
    cookDate: ImmutableDate
  ) => { active: boolean; reason?: string };
}
