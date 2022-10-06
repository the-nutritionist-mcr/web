import { mutate } from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

export const prefetch = (paths: string[]) => {
  paths.forEach((path) => mutate(path, swrFetcher(path)));
};
