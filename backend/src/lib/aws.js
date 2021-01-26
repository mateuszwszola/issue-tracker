import aws from 'aws-sdk';

const S3_BUCKET = process.env.S3_BUCKET_NAME;

aws.config.region = 'eu-central-1';

export { aws, S3_BUCKET };
