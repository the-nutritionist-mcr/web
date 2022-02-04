import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

interface Me {
  first_name: string;
  last_name: string;
  email: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  city: string;
  country: string;
  phone: string;
  postcode: string;
}

export const useMe = () => {
  const { data } = useSWR<Me>('customers/me', swrFetcher);

  return data;
};
