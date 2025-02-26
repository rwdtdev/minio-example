'use client';

import { Download } from 'lucide-react';

type Props = {
  name: string;
};
export function DownloadItem({ name }: Props) {
  // console.log('🚀 ~ name:', name);
  return (
    <>
      <Download
        size={20}
        className='mr-2'
        onClick={async () => {
          const res = await fetch('/api/minio/streamfile?' + name);
          const contentType = res.headers.get('content-type') || undefined;
          console.log('🚀 ~ onClick={ ~ contentType:', contentType);
          const result = await res.arrayBuffer();
          console.log(result);
          const blob = new Blob([result], { type: contentType });
          let link = document.createElement('a');
          link.download = name;
          link.href = URL.createObjectURL(blob);
          console.log('🚀 ~ .then ~ href:', link.href);
          link.click();
        }}
      />
    </>
  );
}
