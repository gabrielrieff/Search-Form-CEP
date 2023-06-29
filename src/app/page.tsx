'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useEffect } from 'react';
import { schemaForm } from './schema';
import { AddressProps } from './type';

type formProps = z.infer<typeof schemaForm>;

export default function Cep() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<formProps>({
    criteriaMode: 'all',
    mode: 'all',
    resolver: zodResolver(schemaForm),
    defaultValues: {
      address: {
        zipCode: '',
        street: '',
        district: '',
        number: '',
        complement: '',
        city: '',
        state: ''
      }
    }
  });

  const zipCode = watch('address.zipCode');

  const handleSubmitForm = (data: formProps) => {
    console.log(data);
  };

  const handleSetData = useCallback(
    (data: AddressProps) => {
      setValue('address.zipCode', data.cep);
      setValue('address.street', data.logradouro);
      setValue('address.district', data.bairro);
      setValue('address.complement', data.complemento);
      setValue('address.state', data.uf);
      setValue('address.city', data.localidade);
    },
    [setValue]
  );

  const handleFetchAddress = useCallback(
    async (zipCode: string) => {
      const code = zipCode.replace(/[^0-9]/g, '');

      if (code.length !== 8) return;

      const dataFetch = await fetch(
        `https://viacep.com.br/ws/${code}/json/`
      ).then((response) => {
        return response.json().then((data) => {
          return data;
        });
      });
      handleSetData(dataFetch);
    },
    [handleSetData]
  );

  useEffect(() => {
    setValue('address.zipCode', zipCode);

    if (zipCode == undefined) return;
    if (zipCode.length !== 8) return;

    handleFetchAddress(zipCode);
  }, [handleFetchAddress, setValue, zipCode]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col w-[80%] bg-slate-50 p-8 rounded-lg shadow-sm shadow-neutral-900">
        <h2 className="text-center font-bold text-blue-900 text-[43px]">CEP</h2>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col gap-[20px]"
        >
          <input
            {...register('address.zipCode')}
            placeholder="Cep"
            type="text"
            maxLength={9}
          />
          {errors.address?.zipCode?.message && (
            <p>{errors.address?.zipCode?.message}</p>
          )}

          <input
            {...register('address.street')}
            placeholder="Rua"
            type="text"
          />
          {errors.address?.street?.message && (
            <p>{errors.address?.street?.message}</p>
          )}

          <input
            {...register('address.district')}
            placeholder="Bairro"
            type="text"
          />

          {errors.address?.district?.message && (
            <p>{errors.address?.district?.message}</p>
          )}

          <input
            {...register('address.complement')}
            placeholder="Complemento"
            type="text"
          />
          {errors.address?.complement?.message && (
            <p>{errors.address?.complement?.message}</p>
          )}

          <input
            {...register('address.city')}
            placeholder="Cidade"
            type="text"
          />
          {errors.address?.city?.message && (
            <p>{errors.address?.city?.message}</p>
          )}

          <input
            {...register('address.state')}
            placeholder="Estado"
            type="text"
          />

          {errors.address?.state?.message && (
            <p>{errors.address?.state?.message}</p>
          )}
          <button
            className="bg-blue-500 p-2 rounded-md text-white transition-all hover:bg-blue-700"
            type="submit"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}
