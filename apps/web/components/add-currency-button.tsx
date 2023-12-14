import { Currency } from '@repo/structure';
import { useMutation } from '@tanstack/react-query';
import { CurrencyRefetch } from '../app/page';
import clsx from 'clsx';

export const AddCurrency: React.FC<{
  currencies: [string, Currency][];
  onSave: () => CurrencyRefetch;
}> = ({ currencies, onSave }) => {
  const { mutate } = useMutation({
    mutationKey: ['changeCurrency'],
    mutationFn: async (currencyKey: string) => {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/currency/${currencyKey}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visible: true,
          }),
        }
      );
      return onSave();
    },
  });

  return (
    <div
      className={clsx(
        'relative flex flex-col items-center justify-center w-full p-12 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg bg-stone-100/50',
        'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
        'hover:border-gray-400'
      )}
    >
      <select
        id="add-location"
        name="add-location"
        className="absolute top-0 left-0 w-full h-full opacity-0"
        aria-label="Add location"
        onChange={({ currentTarget: { value } }) => {
          mutate(value);
        }}
      >
        {currencies.map(([key]) => (
          <option key={key}>{key}</option>
        ))}
      </select>
      <BoxSVG />
      <span className="block mt-2 text-sm font-semibold text-gray-900">
        Add Currency
      </span>
    </div>
  );
};

const BoxSVG: React.FC = () => (
  <svg
    className="w-12 h-12 mx-auto text-gray-400 aspect-square"
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.28856 0.796908C7.42258 0.734364 7.57742 0.734364 7.71144 0.796908L13.7114 3.59691C13.8875 3.67906 14 3.85574 14 4.05V10.95C14 11.1443 13.8875 11.3209 13.7114 11.4031L7.71144 14.2031C7.57742 14.2656 7.42258 14.2656 7.28856 14.2031L1.28856 11.4031C1.11252 11.3209 1 11.1443 1 10.95V4.05C1 3.85574 1.11252 3.67906 1.28856 3.59691L7.28856 0.796908ZM2 4.80578L7 6.93078V12.9649L2 10.6316V4.80578ZM8 12.9649L13 10.6316V4.80578L8 6.93078V12.9649ZM7.5 6.05672L12.2719 4.02866L7.5 1.80176L2.72809 4.02866L7.5 6.05672Z"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>
);
