import * as Minio from 'minio';
import { Readable } from 'stream';

const minioClient = new Minio.Client({
  endPoint: '95.163.241.119',
  port: 9000,
  useSSL: false,
  accessKey: 'QZ616Rcrn2U3uJZjM0ou',
  secretKey: 'O1tOUF0OIrL00jzGTjsNNRwhoFTmxhnU1qyoqTMb',
});

const bucket = 'minio-bucket-1';

export async function GET(req: Request) {
  const requestHeaders = new Headers(req.headers);
  const range = requestHeaders.get('range');
  console.log('🚀 ~ GET ~ range:', range);

  // const objectName = req.url.split('?')[1];
  const objectName = decodeURI(new URL(req.url).search).substring(1);

  const stats = await minioClient.statObject(bucket, objectName);

  const videoSize = stats.size;
  const start = Number(range?.replace(/\D/g, ''));
  // const end = Math.min(start + 1000_000, videoSize - 1);
  const end = videoSize - 1;

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
      'Content-Length': `${end - start + 1}`,
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
