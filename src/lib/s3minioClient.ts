import * as Minio from 'minio';

export type MinioOjectType = {
  name: string;
  lastModified: Date;
  etag: string;
  size: number;
};

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST,
  port: process.env.MINIO_PORT,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const bucket = process.env.MINIO_BUCKET;
