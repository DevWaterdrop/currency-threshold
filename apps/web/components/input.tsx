'use client';

import clsx from 'clsx';
import { useId, useState } from 'react';

export const Input: React.FC<{
  value: number;
  onChange: (value: string) => void;
  label: string;
  prefix: string;
  error?: string;
}> = ({ value, onChange, label, prefix, error }) => {
  const id = useId();

  const [focused, setFocused] = useState(false);

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium text-gray-500 truncate"
        htmlFor={`${prefix}-${id}`}
      >
        {label}
      </label>
      <div className="relative flex">
        <input
          type="text"
          name={`${prefix}-${id}`}
          id={`${prefix}-${id}`}
          className={clsx(
            error
              ? 'border-red-500'
              : 'border-gray-200 border-dashed focus:border-solid focus:border-blue-500',
            'text-2xl font-semibold w-full tracking-tight text-gray-800 transition-colors border-b-2 outline-none ring-0',
            'placeholder:text-gray-400'
          )}
          placeholder="1.00"
          value={value}
          pattern="[1-9][0-9]*([.][0-9]?)?"
          onChange={({ currentTarget: { value } }) => {
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (value.match(regex)) {
              onChange(value);
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {!focused && (
          <div
            aria-hidden="true"
            className="absolute right-0 self-center text-gray-500 pointer-events-none select-none"
          >
            <PencilSVG />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

const PencilSVG: React.FC = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
};
