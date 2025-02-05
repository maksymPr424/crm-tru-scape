'use client';

import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPromotion, getCompany } from '@/lib/api';
import Button from '@/app/components/button';
import InputField from '@/app/components/input-field';
import LogoUploader from '@/app/components/logo-uploader';

export type PromotionFieldValues = {
  title: string;
  description: string;
  discount: string | number;
};

const initialValues: PromotionFieldValues = {
  title: '',
  description: '',
  discount: '',
};

export interface PromotionFormProps {
  companyId: string;
  onSubmit?: (values: PromotionFieldValues) => void | Promise<void>;
}

export default function PromotionForm({
  companyId,
  onSubmit,
}: PromotionFormProps) {
  const queryClient = useQueryClient();

  const { data: company, error, isLoading } = useQuery({
    queryKey: ['companies', companyId],
    queryFn: () => getCompany(companyId),
    staleTime: 10 * 1000,
    enabled: Boolean(companyId),
  });

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotions', companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ['promotions'],
        exact: true,
      });
    },
    onError: (error) => {
      console.error('Error creating promotion:', error);
    },
  });

  const handleSubmit = async (values: PromotionFieldValues) => {
    if (!company) {
      console.error('Company not found');
      return;
    }

    try {
      await mutateAsync({
        ...values,
        discount: Number(values.discount) || 0,
        companyId: company.id,
        companyTitle: company.title,
      });

      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      console.error('Error submitting promotion form:', error);
    }
  };

  const [formInitialValues, setFormInitialValues] = useState<PromotionFieldValues>(initialValues);

  useEffect(() => {
    if (company) {
      setFormInitialValues({
        title: '',
        description: '',
        discount: '',
      });
    }
  }, [company]);

  if (isLoading) {
    return <p>Loading company data...</p>;
  }

  if (isError) {
    return <p>Error loading company data: {error?.message}</p>;
  }

  return (
    <Formik initialValues={formInitialValues} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-10">
        <p className="mb-0.5 text-xl">Add new promotion</p>
        <div className="flex flex-col gap-5">
          <InputField required label="Title" placeholder="Title" name="title" />
          <InputField
            required
            label="Description"
            placeholder="Description"
            name="description"
          />
          <InputField
            required
            type="number"
            label="Discount"
            placeholder="Discount"
            name="discount"
          />
          <LogoUploader label="Image" placeholder="Upload photo" />
        </div>
        <Button type="submit" disabled={isPending}>
          Add promotion
        </Button>
      </Form>
    </Formik>
  );
}
