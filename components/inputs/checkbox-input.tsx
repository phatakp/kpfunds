'use client';

import type { CheckedState } from '@radix-ui/react-checkbox';
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

export interface CheckboxInputProps<T extends FieldValues>
  extends React.ComponentProps<typeof Checkbox> {
  register: UseFormRegisterReturn<FieldPath<T>>;
  label: string;
  boxLabel?: string;
  description?: string;
  handleChange?: (val: boolean) => void;
}

export function CheckboxInput<T extends FieldValues>({
  label,
  register,
  description,
  disabled,
  handleChange,
  ...props
}: CheckboxInputProps<T>) {
  const onChange = (
    val: CheckedState,
    field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>
  ) => {
    if (handleChange) handleChange(field.value);
    return field.onChange(val);
  };

  return (
    <FormField
      {...register}
      render={({ field }) => (
        <FormItem className="flex w-full items-center gap-2 py-1">
          <FormControl>
            <Checkbox
              checked={field.value}
              disabled={disabled}
              onCheckedChange={(val) => onChange(val, field)}
              {...props}
            />
          </FormControl>
          <div className="space-y-0.5">
            <FormLabel className={cn('', disabled && 'text-muted-foreground')}>
              {label}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  );
}
