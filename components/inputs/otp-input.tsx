"use client";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import type {
	FieldPath,
	FieldValues,
	UseFormRegisterReturn,
} from "react-hook-form";

export interface OTPFieldProps<T extends FieldValues>
	extends React.ComponentProps<typeof Input> {
	register: UseFormRegisterReturn<FieldPath<T>>;
	label?: string;
	description?: string;
	containerClassName?: string;
}

export function TextOTPInput<T extends FieldValues>({
	register,
	className,
}: OTPFieldProps<T>) {
	return (
		<FormField
			{...register}
			render={({ field }) => (
				<FormItem className={cn("w-full", className)}>
					<FormLabel>One-Time Password</FormLabel>
					<FormControl>
						<InputOTP maxLength={6} {...field}>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</FormControl>
					<FormDescription>
						Please enter the one-time password sent to your email.
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
