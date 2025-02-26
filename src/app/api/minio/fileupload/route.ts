import { bucket, minioClient } from '@/lib/s3minioClient';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const filename = req.headers
    .get('Content-Disposition')
    ?.split('filename=')[1]
    .split(';')
    .map((item) => String.fromCharCode(Number(item)))
    .join('');
  const ContentType = req.headers.get('Content-type');
  console.log('🚀 ~ filename=', filename, ContentType);
  const res = await req.arrayBuffer();
  const buff = Buffer.from(res);

  console.log('minioClient.putObject start ');
  await minioClient.putObject(
    bucket,
    filename!,
    buff,
    Buffer.byteLength(buff),
    { 'content-type': ContentType } /* ,
    function (err: Error, objInfo: any) {
      if (err) {
        return console.log(err); // err should be null
        }
        console.log('Success', objInfo);
        } */
  );
  console.log('minioClient.putObject finish ');
  revalidatePath('/', 'page');

  return new Response('', { status: 200 });
}
