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
  // console.log('🚀 ~ HomePage ~ res:', minioItemsList);
  return (
    <>
      <h1>HomePage</h1>
      <ul className='flex flex-wrap justify-start'>
        {minioItemsList.map((minioItem) => (
          <li key={minioItem.name} className=' mr-5 mb-5 min-h-40'>
            <MinioItem data={minioItem} />
            <div className='flex'>
              <DownloadItem name={minioItem.name} />
              <span className='text-sm'>{minioItem.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <DropZoneBlock />
    </>
  );
}
