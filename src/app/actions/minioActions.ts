'use server';

import { bucket, minioClient, MinioOjectType } from '@/lib/s3minioClient';
import { BucketItemStat } from 'minio';

export async function getMinioFileList(): Promise<
  (MinioOjectType & BucketItemStat)[]
> {
  const listObjects: MinioOjectType[] = [];

  const stream = minioClient.listObjectsV2(bucket, '', true, '');

  await new Promise((resolve, reject) => {
    stream.on('data', (obj: MinioOjectType) => {
      //   console.log('stream on data', obj);
      // const stats = await minioClient.statObject(bucket, obj.name);
      // console.log('🚀 ~ stats:', stats);
      listObjects.push(obj);
    });
    stream.on('error', (err) => {
      console.log(err);
      reject();
    });
    stream.on('end', () => {
      //   console.log('🚀 ~ listObjects:', listObjects);
      resolve(true);
    });
  });
  return Promise.all(
    listObjects.map(
      (obj) =>
        new Promise(
          async (resolve: (value: MinioOjectType & BucketItemStat) => void) => {
            const stats = await minioClient.statObject(bucket, obj.name);
            // console.log('🚀 ~ listObjects.forEach ~ stats:', obj.name, {
            //   ...obj,
            //   ...stats,
            // });
            resolve({ ...obj, ...stats });
          }
        )
    )
  );
}
