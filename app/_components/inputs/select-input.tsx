"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
    FieldPath,
    FieldValues,
    useFormContext,
    UseFormRegisterReturn,
} from "react-hook-form";

export type SelectFieldOption<
    K extends string = string,
    V extends string = string
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
    name,
    label,
    className,
    description,
    disabled,
    options,
    defaultValue,
    placeholder = " ",
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
                <FormItem className={cn("flex w-full flex-col", className)}>
                    <div className="group relative z-0 w-full">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    {isLoading ? (
                                        <Skeleton className="h-12 w-full" />
                                    ) : (
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            isLoading={isLoading}
                                            disabled={disabled}
                                            className={cn(
                                                "bg-input/30 w-full justify-between",
                                                !field.value &&
                                                    "text-muted-foreground",
                                                isError &&
                                                    "ring-destructive border-destructive"
                                            )}
                                        >
                                            {field.value ? (
                                                options.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value
                                                )?.label
                                            ) : (
                                                <span className="bg-input rounded-sm px-2">
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
                                    <CommandInput
                                        placeholder={`Search ${label}...`}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            No {label} found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {options.map((opt) => (
                                                <CommandItem
                                                    value={opt.label}
                                                    key={opt.value}
                                                    onSelect={() => {
                                                        if (handleChange)
                                                            handleChange(
                                                                opt.value
                                                            );
                                                        setValue(
                                                            field.name,
                                                            opt.value as any
                                                        );
                                                        clearErrors(field.name);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            opt.value ===
                                                                field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
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
                                    "bg-background text-muted-foreground peer-placeholder-shown:bg-background peer-placeholder-shown:text-muted-foreground peer-focus:bg-background peer-focus:text-foreground absolute top-4 left-3 z-10 origin-[0] -translate-y-6 scale-75 transform rounded-sm px-2 text-sm leading-none duration-300 peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:py-1 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                    disabled &&
                                        "text-muted-foreground opacity-70",
                                    isError &&
                                        "text-destructive peer-placeholder-shown:bg-destructive peer-placeholder-shown:text-destructive-foreground"
                                )}
                            >
                                {label}
                            </FormLabel>
                        )}
                    </div>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
