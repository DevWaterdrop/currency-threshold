'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Currency } from '@repo/structure';
import { roundByTwo } from '@repo/utils';
import { FavoriteButton } from './favorite-button';
import { RemoveButton } from './remove-button';
import { CurrencyRefetch } from '../app/page';
import { SaveButton } from './save-button';
import { ResetButton } from './reload-button';
import { Input } from './input';
import clsx from 'clsx';

export const CurrencyItem: React.FC<{
  currencyKey: string;
  data: Currency;
  onSave: () => CurrencyRefetch;
}> = ({ currencyKey, data, onSave }) => {
  const [currency, setCurrency] = useState<Currency>(data);

  const error = useMemo(() => {
    return {
      upper: Number(currency.bound.upper) <= Number(currency.current),
      bottom: Number(currency.bound.lower) >= Number(currency.current),
    };
  }, [currency]);

  const isChanged = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(currency),
    [data, currency]
  );

  const isSaveDisabled = useMemo(
    () => !isChanged || error.bottom || error.upper,
    [isChanged, error]
  );

  const { mutate } = useMutation({
    mutationKey: ['changeCurrency'],
    mutationFn: async (mutationData: Partial<Currency>) => {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/currency/${currencyKey}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current: mutationData.current,
            upper: mutationData.bound?.upper,
            lower: mutationData.bound?.lower,
            favorite: mutationData.favorite,
            visible: mutationData.visible,
          }),
        }
      );
      const { data } = await onSave();
      if (data?.[currencyKey]) setCurrency(data[currencyKey]!);
    },
  });

  const handleSave = () => {
    mutate({
      bound: {
        upper: Number(currency.bound.upper),
        lower: Number(currency.bound.lower),
      },
      current: Number(currency.current),
    });
  };

  const handleFavorite = () => {
    mutate({ favorite: !currency.favorite });
  };

  const handleRemove = () => {
    mutate({ visible: false });
  };

  const handleReset = () => {
    setCurrency(data);
  };

  const handleCurrentRateChange = (value: any) => {
    const difference = Number(value) - Number(currency.current);

    setCurrency((prev) => {
      const upper = roundByTwo(prev.bound.upper + difference);
      const lower = roundByTwo(prev.bound.lower + difference);

      return {
        ...prev,
        current: value,
        bound: {
          upper: upper > 0 ? upper : 0,
          lower: lower > 0 ? lower : 0,
        },
      };
    });
  };

  const handleUpperBoundChange = (value: any) => {
    setCurrency((prev) => ({
      ...prev,
      bound: { ...prev.bound, upper: value },
    }));
  };

  const handleLowerBoundChange = (value: any) => {
    setCurrency((prev) => ({
      ...prev,
      bound: { ...prev.bound, lower: value },
    }));
  };

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-4 px-4 pt-5 pb-16 overflow-hidden bg-white rounded-lg shadow',
        'sm:px-6 sm:pt-6'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FavoriteButton
            isFavorite={currency.favorite}
            onChange={handleFavorite}
          />
          <p className="text-2xl font-bold truncate">{currencyKey}</p>
        </div>
        <p className="text-sm font-medium text-green-600 truncate">
          Rate: {data.exchange}
        </p>
      </div>
      <Input
        label="Current rate"
        prefix="current"
        onChange={handleCurrentRateChange}
        value={currency.current}
      />
      {/* Bound */}
      <div
        className={clsx(
          'grid items-start grid-cols-1 gap-4 pb-5',
          'sm:grid-cols-2 sm:pb-6'
        )}
      >
        <Input
          label="Upper bound"
          prefix="upper-bound"
          onChange={handleUpperBoundChange}
          value={currency.bound.upper}
          error={error.upper ? 'Must be greater than Current rate' : undefined}
        />
        <Input
          label="Lower bound"
          prefix="lower-bound"
          onChange={handleLowerBoundChange}
          value={currency.bound.lower}
          error={error.bottom ? 'Must be less than Current rate' : undefined}
        />
      </div>
      {/* Menu */}
      <div
        className={clsx(
          'absolute inset-x-0 bottom-0 px-4 py-4 border-t bg-gray-50',
          'sm:px-6'
        )}
      >
        <div className="flex items-center gap-4">
          <SaveButton onSave={handleSave} disabled={isSaveDisabled} />
          <ResetButton onReset={handleReset} disabled={!isChanged} />
          <RemoveButton onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
};
