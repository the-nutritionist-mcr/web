import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { asStream } from './as-stream';
import { Upload } from '@aws-sdk/lib-storage';

interface KeyProps {
  fileName: string;
  format: string;
  height?: number;
  width?: number;
  quality?: number;
  size?: number;
}

const getSharpStream = ({
  format,
  height,
  width,
  size,
  quality,
}: Omit<KeyProps, 'fileName'>) => {
  const options = quality ? { quality } : {};
  if (!height && width) {
    return sharp()
      .resize(width)
      .toFormat(format as 'jpeg', options);
  }

  if (size) {
    return sharp()
      .resize(size)
      .toFormat(format as 'jpeg', options);
  }

  return sharp()
    .resize(width, height)
    .toFormat(format as 'jpeg', options);
};

const getProcessedKey = ({
  fileName,
  format,
  height,
  width,
  size,
  quality,
}: KeyProps) => {
  const sizeString = size ? [`size:${size}`] : [];
  const heightString = height ? [`height:${height}`] : [];
  const widthString = width ? [`width:${width}`] : [];
  const qualityString = quality ? [`quality:${quality}`] : [];

  const finalString = [
    ...sizeString,
    ...heightString,
    ...widthString,
    ...qualityString,
    `format:${format}`,
  ].join(':');

  return `processed/${fileName}/${finalString}`;
};

const getS3Url = (key: string) => {
  return `http://${process.env['BUCKET_NAME']}.s3-website.${process.env['AWS_REGION']}.amazonaws.com/${key}`;
};

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
