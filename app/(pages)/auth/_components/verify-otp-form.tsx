"use client";

import { TextOTPInput } from "@/components/inputs/otp-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod/v4";

const formSchema = z.object({
    otp: z.string({ error: "OTP is required" }).min(6),
});

export function VerifyOTPForm({ email }: { email: string }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { data, error } = await signIn.emailOtp({
            email,
            otp: values.otp,
        });

        if (data?.user) router.push("/profile");
        else toast.error(error?.message ?? "");
    }

    return (
        <Form {...form}>
            <form
                className={cn("flex flex-col gap-6")}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid gap-6">
                    <TextOTPInput register={form.register("otp")} />

                    <Button type="submit" className="w-full">
                        Verify OTP
                    </Button>
                </div>
            </form>
        </Form>
    );
}
