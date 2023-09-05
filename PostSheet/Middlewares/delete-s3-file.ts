import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
export async function deleteFileFromS3(bucket: string, key: string): Promise<void> {
  const params = { Bucket: bucket, Key: key };
  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
}