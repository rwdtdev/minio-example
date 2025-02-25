'use client';

import { MinioOjectType } from '@/lib/s3minioClient';
import { BucketItemStat } from 'minio';

export function MinioItem({ data }: { data: MinioOjectType & BucketItemStat }) {
  if (data.metaData['content-type'].includes('video')) {
    return (
      <video width='320' height='240' controls>
        <source
          src={'/api/minio/streamvideo?' + data.name}
          type='video/mp4'
        ></source>
        {data.name}
      </video>
    );
  } else if (data.metaData['content-type'].includes('image')) {
    return <img src={'/api/minio/streamvideo?' + data.name} alt='' />;
  } else if (
    data.metaData['content-type'].includes('application/msword') ||
    data.metaData['content-type'].includes(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  ) {
    return <img src={'/msword.svg'} height={100} width={100} alt='' />;
  } else {
    return (
      <div
        onClick={async () => {
          const res = await fetch('/api/minio/streamfile?' + name);
          const contentType = res.headers.get('content-type') || undefined;
          console.log('🚀 ~ onClick={ ~ contentType:', contentType);
          const result = await res.arrayBuffer();
          console.log(result);
          const blob = new Blob([result], { type: contentType });
          let link = document.createElement('a');
          link.download = data.name;
          link.href = URL.createObjectURL(blob);
          console.log('🚀 ~ .then ~ href:', link.href);
          link.click();
        }}
      >
        {data.name}
      </div>
    );
  }
}
