import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import stream from 'node:stream';

const s3Client = new S3Client({});

export const getS3Stream = (
  bucket: string,
  key: string,
  contentType: string
) => {
  const pass = new stream.PassThrough();
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: pass,
      ContentType: contentType,
    },
  });

  upload.done().then((res, error) => {
    console.log(res);
  });

  return pass;
};
