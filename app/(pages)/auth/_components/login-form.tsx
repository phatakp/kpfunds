"use client";

import { TextInput } from "@/components/inputs/text-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { emailOtp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod/v4";

const formSchema = z.object({ email: z.email({ error: "Email is required" }) });

export function LoginForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { data, error } = await emailOtp.sendVerificationOtp({
            email: values.email,
            type: "sign-in", // or "email-verification", "forget-password"
        });

        if (data?.success) router.push(`/auth/verify?email=${values.email}`);
        else toast.error(error?.message ?? "");
    }

    return (
        <Form {...form}>
            <form
                className={cn("flex flex-col gap-6")}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid gap-6">
                    <TextInput
                        label="Email"
                        register={form.register("email")}
                    />

                    <Button type="submit" className="w-full">
                        Get OTP
                    </Button>
                </div>
            </form>
        </Form>
    );
}
