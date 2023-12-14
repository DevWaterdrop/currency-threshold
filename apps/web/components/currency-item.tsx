'use client';

import { useId, useMemo, useState } from 'react';
import { Currency } from '../app/page';
import { useMutation } from '@tanstack/react-query';

export const CurrencyItem: React.FC<{
  name: string;
  data: Currency;
  onSave: () => Promise<unknown>;
}> = ({ name, data, onSave }) => {
  const [currency, setCurrency] = useState<Currency>(data);

  const isChanged = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(currency),
    [data, currency]
  );

  const { mutate } = useMutation({
    mutationKey: ['changeCurrency'],
    mutationFn: async () => {
      await fetch(`http://localhost:3001/currency/${name}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current: currency.current,
          upper: currency.bound.upper,
          lower: currency.bound.lower,
        }),
      });
      return onSave();
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <div className="overflow-hidden relative rounded-lg flex flex-col gap-2 pb-12 bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6">
      <div className="flex gap-4 items-center">
        <p className="truncate text-2xl font-bold">{name}</p>
        <p className="truncate text-sm font-medium text-green-600">
          Rate: {data.exchange}
        </p>
      </div>
      <Input
        label="Current rate"
        prefix="current"
        onChange={(value) => {
          setCurrency((prev) => ({
            ...prev,
            current: value,
          }));
        }}
        value={currency.current}
      />
      <div className="flex items-center w-full pb-5 sm:pb-6 flex-col sm:flex-row gap-2">
        <Input
          label="Upper bound"
          prefix="upper-bound"
          onChange={(value) => {
            setCurrency((prev) => ({
              ...prev,
              bound: {
                ...prev.bound,
                upper: value,
              },
            }));
          }}
          value={currency.bound.upper}
        />
        <Input
          label="Lower bound"
          prefix="lower-bound"
          onChange={(value) => {
            setCurrency((prev) => ({
              ...prev,
              bound: {
                ...prev.bound,
                lower: value,
              },
            }));
          }}
          value={currency.bound.lower}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gray-50 border-t px-4 py-4 sm:px-6">
        <div className="text-sm">
          <button
            type="button"
            className="font-medium disabled:opacity-50 disabled:cursor-not-allowed text-blue-600 hover:text-blue-500 focus:text-blue-500 transition-colors focus:outline-none"
            onClick={handleClick}
            disabled={!isChanged}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const Input: React.FC<{
  value: number;
  onChange: (value: number) => void;
  label: string;
  prefix: string;
}> = ({ value, onChange, label, prefix }) => {
  const id = useId();

  return (
    <div className="flex flex-col w-1/2 gap-1">
      <label
        className="truncate text-sm font-medium text-gray-500"
        htmlFor={`${prefix}-${id}`}
      >
        {label}
      </label>
      <input
        type="text"
        name={`${prefix}-${id}`}
        id={`${prefix}-${id}`}
        className="text-2xl font-semibold tracking-tight outline-none border-b-2 border-transparent transition-colors focus:border-blue-500 ring-0 text-gray-900 placeholder:text-gray-400"
        placeholder="0.00"
        value={value}
        onChange={({ currentTarget: { value } }) => {
          onChange(Number(value));
        }}
      />
    </div>
  );
};
