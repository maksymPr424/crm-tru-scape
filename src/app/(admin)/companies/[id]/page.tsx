export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Company, getCompany, getPromotions } from '@/lib/api';
import getQueryClient from '@/lib/utils/getQueryClient';
import CompanyInfo from '@/app/components/company-info';
import CompanyPromotions from '@/app/components/company-promotions';

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

  await queryClient.prefetchQuery({
    queryKey: ['promotions', resolvedParams.id],
    queryFn: () =>
      getPromotions({ companyId: resolvedParams.id }, { cache: 'no-store' }),
    staleTime: 10 * 1000,
  });

  const company = queryClient.getQueryData([
    'companies',
    resolvedParams.id,
  ]) as Company;
  if (!company) {
    notFound();
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="py-6 px-10 grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <CompanyInfo companyId={resolvedParams.id} />
        </div>
        <div className="col-span-9">
          <CompanyPromotions companyId={resolvedParams.id} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
