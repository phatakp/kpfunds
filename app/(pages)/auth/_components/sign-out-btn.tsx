"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function SignOutButton() {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleClick() {
        await signOut({
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("You’ve logged out. See you soon!");
                    router.push("/auth/login");
                },
            },
        });
    }

    return (
        <Button
            onClick={handleClick}
            size="sm"
            isLoading={isPending}
            className="rounded-full"
        >
            Sign out <LogOutIcon />
        </Button>
    );
}
