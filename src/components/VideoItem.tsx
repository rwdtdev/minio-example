'use client';

import { MinioOjectType } from '@/lib/s3minioClient';

export function VideoItem({ data }: { data: MinioOjectType }) {
  return (
    <video width='320' height='240' controls>
      <source
        src={'/api/minio/streamvideo?' + data.name}
        type='video/mp4'
      ></source>
      {data.name}
    </video>
  );
}
