import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

export const asStream = (response: GetObjectCommandOutput) => {
  return response.Body as Readable;
};
