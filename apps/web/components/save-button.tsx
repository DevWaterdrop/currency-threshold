import clsx from 'clsx';

export const SaveButton: React.FC<{
  disabled: boolean;
  onSave: () => void;
}> = ({ disabled, onSave }) => {
  return (
    <button
      type="button"
      className={clsx(
        'px-6 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded shadow-sm',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:bg-blue-500'
      )}
      onClick={onSave}
      disabled={disabled}
    >
      Save
    </button>
  );
};
