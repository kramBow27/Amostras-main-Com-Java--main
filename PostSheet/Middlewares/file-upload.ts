import multer from "multer";
import multerS3 from "multer-s3";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";




const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private',
    key: function (request, file, cb) {
      
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
   
    if (file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .csv and .xls file formats are allowed!'));
    }
  },
}).single('File'); 
export async function getFileStream(bucket: string, key: string): Promise<Readable> {
  const params = { Bucket: bucket, Key: key };
  const command = new GetObjectCommand(params);
  const response = await s3Client.send(command);
  return response.Body as Readable;
}
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
export default upload;


