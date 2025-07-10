'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type UseFormRegisterReturn,
  useFormContext,
} from 'react-hook-form';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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

export type SelectFieldOption<
  K extends string = string,
  V extends string = string,
> = {
  label: K;
  value: V;
};

export interface SelectInputProps<TFieldValues extends FieldValues>
  extends ButtonProps {
  register: UseFormRegisterReturn<FieldPath<TFieldValues>>;
  options: SelectFieldOption[];
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: TFieldValues[FieldPath<TFieldValues>];
  handleChange?: (val: any) => void;
}

export function SelectInput<TFieldValues extends FieldValues>({
  register,
  label,
  className,
  description,
  disabled,
  options,
  defaultValue,
  placeholder = ' ',
  isLoading = false,
  handleChange,
}: SelectInputProps<TFieldValues>) {
  const [open, setOpen] = useState(false);
  const {
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const isError = Object.keys(errors).length > 0;

  return (
    <FormField
      {...register}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={cn('flex w-full flex-col', className)}>
          <div className="group relative z-0 w-full">
            <Popover onOpenChange={setOpen} open={open}>
              <PopoverTrigger asChild>
                <FormControl>
                  {isLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <Button
                      className={cn(
                        'peer w-full justify-between rounded-md bg-input/30',
                        !field.value && 'text-muted-foreground',
                        isError && 'border-destructive ring-destructive'
                      )}
                      disabled={disabled}
                      isLoading={isLoading}
                      role="combobox"
                      variant="outline"
                    >
                      {field.value ? (
                        options.find((opt) => opt.value === field.value)?.label
                      ) : (
                        <span className="rounded-sm bg-transparent px-2">
                          Select {label}
                        </span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  )}
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                    <CommandEmpty>No {label} found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          onSelect={() => {
                            if (handleChange) handleChange(opt.value);
                            setValue(field.name, opt.value as any);
                            clearErrors(field.name);
                            setOpen(false);
                          }}
                          value={opt.label}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              opt.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {opt.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {field.value && (
              <FormLabel
                className={cn(
                  '-translate-y-6 absolute top-4 left-3 z-10 origin-[0] scale-75 transform rounded-sm bg-background px-2 text-muted-foreground text-sm leading-none duration-300',
                  !field.value &&
                    '-translate-y-2 scale-100 bg-transparent py-1 text-muted-foreground',
                  !!field.value &&
                    '-translate-y-6 start-0 scale-75 bg-background font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  disabled && 'text-muted-foreground opacity-70',
                  isError && 'text-destructive '
                )}
              >
                {label}
              </FormLabel>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
