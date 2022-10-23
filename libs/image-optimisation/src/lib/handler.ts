import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HTTP } from '@tnmw/constants';
import sharp from 'sharp';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const s3 = new S3Client({});
  const file = event.pathParameters?.file;

  // const { height, width, size, format } = event.queryStringParameters;

  const command = new GetObjectCommand({
    Bucket: process.env['BUCKET_NAME'],
    Key: file,
  });

  const response = await s3.send(command);

  const finished = await sharp(await response.Body?.transformToByteArray())
    .resize(100)
    .toBuffer();

  return {
    statusCode: HTTP.statusCodes.Ok,
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: finished.toString('base64'),
  };
};
