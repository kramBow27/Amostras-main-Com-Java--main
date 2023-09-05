import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function downloadFileAsStream(s3Key: string): Promise<Readable> {
    
  const downloadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: s3Key
  };

  const { Body } = await s3Client.send(new GetObjectCommand(downloadParams));

  if (!Body || !(Body as Readable).pipe) {
    throw new Error('Unsupported Body type in the S3 response.');
  }

  return Body as Readable;
}
