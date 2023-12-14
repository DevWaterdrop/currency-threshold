'use client';

import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { CurrencyItem } from '../components/currency-item';
import { Currency } from '@repo/structure';
import { AddCurrency } from '../components/add-currency-button';
import clsx from 'clsx';
import { useMemo } from 'react';

export type CurrencyRefetch = Promise<
  QueryObserverResult<Record<string, Currency>, Error>
>;

export default function Page(): JSX.Element {
  const { data, refetch } = useQuery<Record<string, Currency>>({
    queryKey: ['currency'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/currency`);
      return res.json();
    },
  });

  const sortedCurrencies = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).sort(([, a], [, b]) =>
      a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1
    );
  }, [data]);

  return (
    <main className={clsx('flex flex-col min-h-screen p-2', 'sm:p-8')}>
      {!data && <p>Loading...</p>}
      {data && (
        <ul
          className={clsx(
            'grid grid-cols-1 gap-5',
            'sm:gap-8 sm:grid-cols-2',
            'xl:grid-cols-4'
          )}
        >
          {sortedCurrencies.flatMap(([currencyKey, currency]) => {
            if (!currency.visible) return [];

            return (
              <li key={currencyKey}>
                <CurrencyItem
                  currencyKey={currencyKey}
                  data={currency}
                  onSave={refetch}
                />
              </li>
            );
          })}
          <AddCurrency
            currencies={sortedCurrencies.filter(
              ([_currencyKey, { visible }]) => !visible
            )}
            onSave={refetch}
          />
        </ul>
      )}
    </main>
  );
}
