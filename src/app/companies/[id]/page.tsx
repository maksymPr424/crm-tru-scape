import Header from '@/app/components/header';

export interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  
  return (
    <main>
      <Header>Companies ({resolvedParams.id})</Header>
      <p>{new Date().toTimeString()}</p>
    </main>
  );
}
