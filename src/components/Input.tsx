import { Input as BaseInput } from '@base-ui/react/input';

export default function Input({ title, placeholder, value, onChange }: { title: string, placeholder: string, value: string | null, onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col items-start gap-1 text-sm font-semibold text-neutral-950 dark:text-white">
      {title}
      <BaseInput
        placeholder={placeholder}
        value={value === null ? undefined : value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-65 border border-neutral-950 dark:border-white bg-white dark:bg-neutral-950 px-2 text-sm any-pointer-coarse:text-base font-normal text-neutral-950 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 dark:focus:outline-white"
      />
    </label>
  );
}