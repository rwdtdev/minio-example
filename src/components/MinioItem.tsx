'use client';
import { MinioOjectType } from '@/lib/s3minioClient';
import { BucketItemStat } from 'minio';

// #t=0.001 in video source src needs for ios preview picture

export function MinioItem({ data }: { data: MinioOjectType & BucketItemStat }) {
  if (data.metaData['content-type'].includes('video')) {
    return (
      <video width='320' height='240' controls playsInline>
        <source
          src={'/api/minio/streamvideo?' + data.name + '#t=0.001'}
          type='video/mp4'
        ></source>
        {data.name}
      </video>
    );
  } else if (data.metaData['content-type'].includes('image')) {
    return <img src={'/api/minio/streamfile?' + data.name} alt='' />;
  } else if (
    data.metaData['content-type'].includes('application/msword') ||
    data.metaData['content-type'].includes(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  ) {
    return (
      <img
        src={'/msword.svg'}
        height={100}
        width={100}
        alt=''
        onClick={async () => {
          window.open('/wordpreview?name=' + data.name);
        }}
      />
    );
  } else if (data.metaData['content-type'].includes('application/pdf')) {
    return (
      <img
        src={'/pdflogo.svg'}
        alt=''
        onClick={async () => {
          const res = await fetch('/api/minio/streamfile?' + data.name);
          const contentType = res.headers.get('content-type') || undefined;
          const result = await res.arrayBuffer();
          const blob = new Blob([result], { type: contentType });
          const urlBlob = URL.createObjectURL(blob);
          window.open(urlBlob);
        }}
      />
    );
  } else {
    return <img src={'/filequestion.svg'} height={100} width={100} alt='' />;
  }
}
