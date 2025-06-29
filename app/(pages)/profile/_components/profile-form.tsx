"use client";

import { useModal } from "@/app/_components/layouts/modal";
import { SelectInput } from "@/components/inputs/select-input";
import { TextInput } from "@/components/inputs/text-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BUILDINGS } from "@/lib/constants";
import { cn, customResolver } from "@/lib/utils";
import { updateProfile } from "@/server/actions/users.action";
import { ProfileSchema } from "@/server/db/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod/v4";

export function ProfileForm() {
    const router = useRouter();
    const { modalId, closeModal } = useModal();
    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: customResolver(ProfileSchema),
        defaultValues: {
            building: "A",
            flat: 0,
        },
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profile Updated Successfully");
            closeModal(modalId);
            router.push("/");
        },
        onError: (err) => {
            console.error(err);
            toast.error("Could not perform action");
        },
    });

    async function onSubmit(values: z.infer<typeof ProfileSchema>) {
        await mutateAsync(values);
    }

    return (
        <Form {...form}>
            <form
                className={cn("flex flex-col gap-6")}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid gap-6">
                    <SelectInput
                        label="Building"
                        register={form.register("building")}
                        options={buildingOptions}
                    />
                    <TextInput label="Flat" register={form.register("flat")} />

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isPending}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}

const buildingOptions = BUILDINGS.map((b) => ({ label: b, value: b }));
