"use client";

import {
    ControllerRenderProps,
    FieldPath,
    FieldValues,
    useFormContext,
    UseFormRegisterReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { ButtonProps } from "react-day-picker";

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
        setValue,
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
                    <Popover modal open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <div className="group relative z-0 w-full">
                                    {isLoading ? (
                                        <Skeleton className="w-full" />
                                    ) : (
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            disabled={disabled || isLoading}
                                            className={cn(
                                                "peer w-full pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    )}
                                    <FormLabel
                                        className={cn(
                                            "bg-background text-foreground peer-placeholder-shown:bg-muted peer-placeholder-shown:text-muted-foreground peer-focus:bg-background peer-focus:text-foreground absolute top-4 left-3 z-10 origin-[0] -translate-y-6 scale-75 transform rounded-sm px-2 text-sm leading-none duration-300 peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:py-1 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                            disabled &&
                                                "text-muted-foreground opacity-70",
                                            isError &&
                                                "text-destructive peer-placeholder-shown:bg-destructive peer-placeholder-shown:text-destructive-foreground"
                                        )}
                                    >
                                        {label}
                                    </FormLabel>
                                </div>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            className="z-[99] w-auto p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(val) => onChange(val, field)}
                                disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                }
                                autoFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
