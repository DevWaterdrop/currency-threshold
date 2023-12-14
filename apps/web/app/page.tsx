'use client';

import { useQuery } from '@tanstack/react-query';
import { CurrencyItem } from '../components/currency-item';

export interface CurrencyBound {
  upper: number;
  lower: number;
}

export interface Currency {
  bound: CurrencyBound;
  current: number;
  exchange: number;
}

export default function Page(): JSX.Element {
  const { data, refetch } = useQuery<Record<string, Currency>>({
    queryKey: ['currency'],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/currency`);
      return res.json();
    },
  });

  return (
    <main className="flex flex-col min-h-screen p-2 sm:p-8">
      {!data && <p>Loading...</p>}
      {data && (
        <ul className="grid grid-cols-1 gap-5 sm:gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(data).map(([name, currency]) => (
            <li key={name}>
              <CurrencyItem name={name} data={currency} onSave={refetch} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
