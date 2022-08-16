import { recursivelyDeserialiseDate } from '@tnmw/utils';
import useSWR from 'swr';

type useSWRType = typeof useSWR;

export const useSwrWrapper: useSWRType = (...args) => {
  const response = useSWR(args);

  return { ...response, data: recursivelyDeserialiseDate(response.data) };
};
