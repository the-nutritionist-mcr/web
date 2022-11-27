export const getS3Url = (key: string) => {
  return `http://${process.env['BUCKET_NAME']}.s3-website.${process.env['AWS_REGION']}.amazonaws.com/${key}`;
};
