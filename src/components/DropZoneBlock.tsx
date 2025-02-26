'use client';

import Dropzone from 'react-dropzone';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
export function DropZoneBlock() {
  const router = useRouter();
  const [state, setState] = useState(0);
  return (
    <>
      <div>{state}</div>
      <Dropzone
        onDrop={(acceptedFiles) => {
          console.log(acceptedFiles);
          acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = async () => {
              console.log('!!!', reader.result, file.type);
              const filenameAscii = file.name
                .split('')
                .map((letter) => letter.charCodeAt(0))
                .join(';');
              const xhr = new XMLHttpRequest();
              xhr.open('POST', '/api/minio/fileupload');
              xhr.setRequestHeader(
                'Content-Disposition',
                `attachment; filename=${filenameAscii}`
              );
              xhr.setRequestHeader('Content-Type', `${file.type}`);

              xhr.onprogress = (e) => {
                console.log('загружено', e.loaded, e.total);
                setState(e.loaded);
              };

              xhr.upload.addEventListener(
                'progress',
                (e) => {
                  console.log('загружено', e.loaded, e.total);
                  setState(e.loaded);
                },
                false
              );
              xhr.send(reader.result);

              xhr.onload = () => {
                console.log(xhr.status);
                router.refresh();
              };
            };
          });
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section className='border'>
            <div {...getRootProps()} className='h-40'>
              <input {...getInputProps()} />
              <p>
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            </div>
          </section>
        )}
      </Dropzone>
    </>
  );
}
