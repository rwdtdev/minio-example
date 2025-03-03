import { bucket, minioClient } from '@/lib/s3minioClient';
import { Readable } from 'stream';

export async function GET(req: Request) {
  const requestHeaders = new Headers(req.headers);
  const range = requestHeaders.get('range');
  console.log('🚀 ~ GET ~ range:', range);

  // const objectName = req.url.split('?')[1];
  const objectName = decodeURI(new URL(req.url).search).substring(1);

  const stats = await minioClient.statObject(bucket, objectName);

  const videoSize = stats.size;

  const start = Number(range?.split('=')[1].split('-')[0]);
  let end = Number(range?.split('=')[1].split('-')[1]);
  end = end || videoSize - 1;
  console.log('Content-Range:', `bytes ${start}-${end}/${videoSize}`);
  console.log('Content-Length:', `${end - start}`);
  console.log('Content-Type:', stats.metaData['cContent-type']);

  if (start === end) {
    return new Response('', {
      status: 200,
    });
  }

  const res = await minioClient.getPartialObject(
    bucket,
    objectName,
    start,
    end
  );

  const data: ReadableStream = iteratorToStream(nodeStreamToIterator(res));

  return new Response(data, {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': `bytes`,
      'Content-Length': `${end - start}`,
      'Content-Type': stats.metaData['Content-Type'],
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
