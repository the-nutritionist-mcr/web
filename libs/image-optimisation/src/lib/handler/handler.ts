import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { asStream } from './as-stream';
import { Upload } from '@aws-sdk/lib-storage';
import { getProcessedKey } from './get-processed-key';
import { getSharpStream } from './get-sharp-stream';
import { getS3Url } from './get-s3-url';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const s3 = new S3Client({});
  const file = event.pathParameters?.file;

  const height = event.queryStringParameters?.height;
  const width = event.queryStringParameters?.width;
  const size = event.queryStringParameters?.size;
  const format = event.queryStringParameters?.format;

  const options = {
    fileName: file ?? '',
    height: height ? Number(height) : undefined,
    width: width ? Number(width) : undefined,
    size: size ? Number(size) : undefined,
    format: format ?? '',
  };

  const processedKey = getProcessedKey(options);

  const bucket = process.env['BUCKET_NAME'];

  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: processedKey,
  });

  try {
    await s3.send(command);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFound') {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: `raw/${file}`,
      });

      const response = await s3.send(command);

      const stream = asStream(response).pipe(getSharpStream(options));

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: bucket,
          Key: processedKey,
          Body: stream,
          ContentType: `image/${format}`,
        },
      });

      await upload.done();
    }
  }

  return {
    statusCode: 301,
    headers: { location: getS3Url(processedKey) },
  };
};
