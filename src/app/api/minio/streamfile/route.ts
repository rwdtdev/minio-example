import { minioClient } from '@/lib/s3minioClient';
import * as Minio from 'minio';
import { Readable } from 'stream';

const bucket = 'minio-bucket-1';

export async function GET(req: Request) {
  const requestHeaders = new Headers(req.headers);
  console.log('🚀 ~ GET ~ requestHeaders:', requestHeaders);

  // const objectName = req.url.split('?')[1];
  const objectName = decodeURI(new URL(req.url).search).substring(1);
  console.log('🚀 ~ GET ~ objectName:', objectName);

  const res = await minioClient.getObject(bucket, objectName);
  const data: ReadableStream = iteratorToStream(nodeStreamToIterator(res));

  return new Response(data, {
    status: 206,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

async function* nodeStreamToIterator(stream: Readable) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}

function iteratorToStream(iterator: AsyncGenerator<Uint8Array, void, unknown>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
