import { Btn } from '@/components/Btn';
import { getMinioFileList } from './actions/minioActions';
import { VideoItem } from '@/components/VideoItem';
import { DropZoneBlock } from '@/components/DropZoneBlock';
import { MinioOjectType } from '@/lib/s3minioClient';
import { DownloadItem } from '@/components/DownloadItem';
import { BucketItemStat } from 'minio';
import { MinioItem } from '@/components/MinioItem';

export default async function HomePage() {
  const minioItemsList: (MinioOjectType & BucketItemStat)[] =
    await getMinioFileList();
  console.log('🚀 ~ HomePage ~ res:', minioItemsList);
  return (
    <>
      <h1>HomePage</h1>
      <Btn />
      <ul className='flex flex-wrap justify-start'>
        {minioItemsList.map((minioItem) => (
          <li key={minioItem.name} className=' mr-5 mb-5 min-h-40'>
            <MinioItem data={minioItem} />
            {minioItem.name}
          </li>
        ))}
      </ul>
      <DropZoneBlock />
    </>
  );
}

/* {
          console.log(minioItem.name.split('.').at(-1));
          if (minioItem.name.split('.').at(-1) === 'mp4') {
            return (
              <li key={minioItem.name} className=' mr-5 mb-5 min-h-40'>
                <VideoItem key={minioItem.name} data={minioItem} />
              </li>
            );
          } else {
            return (
              <li
                key={minioItem.name}
                className='bg-blue-200 mr-5 mb-5 min-h-40'
              >
                <DownloadItem name={minioItem.name} />
              </li>
            );
          }
        } */
