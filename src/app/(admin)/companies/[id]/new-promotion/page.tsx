
import React from 'react';
import PromotionForm from '@/app/components/promotion-form';

export interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <div className="py-6 px-10">
      <PromotionForm companyId={resolvedParams.id} />
    </div>
  );
}
