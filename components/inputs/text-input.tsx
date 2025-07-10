'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { XCircleIcon } from 'lucide-react';
import {
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormRegisterReturn,
  useFormContext,
} from 'react-hook-form';

export interface InputFieldProps<T extends FieldValues>
  extends React.ComponentProps<typeof Input> {
  register: UseFormRegisterReturn<FieldPath<T>>;
  label?: string;
  description?: string;
  showClear?: boolean;
}

export function TextInput<T extends FieldValues>({
  register,
  label,
  className,
  description,
  type,
  placeholder = ' ',
  showClear = true,
  disabled,
  ...props
}: InputFieldProps<T>) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const isError = Object.keys(errors).length > 0;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>
  ) => {
    const value = e.target.value;
    if (type === 'number')
      return field.onChange(value === '' ? '' : Number(value));
    return field.onChange(value);
  };

  return (
    <FormField
      {...register}
      render={({ field }) => (
        <FormItem
          className={cn('', type === 'hidden' ? 'w-0' : 'w-full', className)}
        >
          <FormControl>
            <div className="group relative z-0 w-full">
              <Input
                {...field}
                {...props}
                className={cn(
                  'peer text-sm',
                  isError &&
                    'text-destructive focus-visible:border-input focus-visible:text-foreground focus-visible:ring-0',
                  !field.value && isError && 'ring-destructive'
                )}
                disabled={disabled}
                onChange={(e) => onChange(e, field)}
                onFocus={(e) => e.target.select()}
                placeholder={placeholder}
                type={type}
              />
              {showClear && (
                <Button
                  className="-translate-y-1/2 absolute top-1/2 right-2 z-10"
                  onClick={() =>
                    setValue(field.name, type === 'number' ? 0 : ('' as any))
                  }
                  size={'icon'}
                  type="button"
                  variant={'ghost'}
                >
                  <XCircleIcon className="" />
                </Button>
              )}
              <FormLabel
                className={cn(
                  '-translate-y-5 peer-placeholder-shown:-translate-y-2 peer-focus:-translate-y-6 absolute top-4 left-3 z-10 origin-[0] scale-75 transform rounded-sm bg-background px-2 text-foreground text-xs leading-none duration-300 peer-placeholder-shown:pointer-events-auto peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent peer-placeholder-shown:py-1 peer-placeholder-shown:text-muted-foreground peer-focus:start-0 peer-focus:scale-75 peer-focus:bg-background peer-focus:font-medium peer-focus:text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  field.value &&
                    '-translate-y-6 start-0 scale-75 bg-background font-medium text-foreground',
                  type === 'hidden' && 'hidden'
                )}
              >
                {label}
              </FormLabel>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
