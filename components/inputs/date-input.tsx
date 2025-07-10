'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import type { ButtonProps } from 'react-day-picker';
import {
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormRegisterReturn,
  useFormContext,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface DateInputProps<TFieldValues extends FieldValues>
  extends ButtonProps {
  register: UseFormRegisterReturn<FieldPath<TFieldValues>>;
  label?: string;
  description?: string;
  isLoading?: boolean;
}
export function DateInput<TFieldValues extends FieldValues>({
  label,
  register,
  description,
  isLoading = false,
  disabled = false,
}: DateInputProps<TFieldValues>) {
  const {
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const isError = Object.keys(errors).length > 0;

  const onChange = (
    val: Date | undefined,
    field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>
  ) => {
    setOpen(false);
    return field.onChange(val);
  };

  return (
    <FormField
      {...register}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <Popover modal onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <FormControl>
                <div className="group relative z-0 w-full">
                  {isLoading ? (
                    <Skeleton className="w-full" />
                  ) : (
                    <Button
                      className={cn(
                        'peer w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={disabled || isLoading}
                      type="button"
                      variant={'outline'}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  )}
                  <FormLabel
                    className={cn(
                      '-translate-y-6 peer-placeholder-shown:-translate-y-2 peer-focus:-translate-y-6 absolute top-4 left-3 z-10 origin-[0] scale-75 transform rounded-sm bg-background px-2 text-foreground text-sm leading-none duration-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-muted peer-placeholder-shown:py-1 peer-placeholder-shown:text-muted-foreground peer-focus:start-0 peer-focus:scale-75 peer-focus:bg-background peer-focus:font-medium peer-focus:text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                      disabled && 'text-muted-foreground opacity-70',
                      isError &&
                        'text-destructive peer-placeholder-shown:bg-destructive peer-placeholder-shown:text-destructive-foreground'
                    )}
                  >
                    {label}
                  </FormLabel>
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="z-[99] w-auto p-0">
              <Calendar
                autoFocus
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                mode="single"
                onSelect={(val) => onChange(val, field)}
                selected={field.value}
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
