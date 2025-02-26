import * as Minio from 'minio';

export type MinioOjectType = {
  name: string;
  lastModified: Date;
  etag: string;
  size: number;
};

if (
  !process.env.MINIO_HOST ||
  !process.env.MINIO_PORT ||
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY ||
  !process.env.MINIO_BUCKET
) {
  throw new Error(
    '!process.env.MINIO_HOST || !process.env.MINIO_PORT ||  !process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY  ||   !process.env.MINIO_BUCKET'
  );
}

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const bucket = process.env.MINIO_BUCKET;
