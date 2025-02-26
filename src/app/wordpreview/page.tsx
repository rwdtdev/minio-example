import { WordPreviewClient } from './WordPreviewClient';

export default async function WordPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ name: string }>;
}) {
  const { name } = await searchParams;

  return <WordPreviewClient name={name} />;
}
