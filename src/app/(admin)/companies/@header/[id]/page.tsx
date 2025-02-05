import Header from '@/app/components/header';
import { Company, getCompany } from '@/lib/api';
import getQueryClient from '@/lib/utils/getQueryClient';

export interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['companies', resolvedParams.id],
    queryFn: () => getCompany(resolvedParams.id, { cache: 'no-store' }),
    staleTime: 10 * 1000,
  });
  const company = queryClient.getQueryData(['companies', resolvedParams.id]) as Company;
  return <Header>{company?.title}</Header>;
}
