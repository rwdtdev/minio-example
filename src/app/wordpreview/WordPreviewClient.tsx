'use client';
import { renderAsync } from 'docx-preview';
import { useEffect } from 'react';

export function WordPreviewClient({ name }: { name: string }) {
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/minio/streamfile?' + name);
      const contentType = res.headers.get('content-type') || undefined;
      const result = await res.arrayBuffer();
      const blob = new Blob([result], { type: contentType });
      renderAsync(blob, document.getElementById('wordpreviewcontainer')!);
    })();
  }, []);

  return <div id='wordpreviewcontainer'></div>;
}
