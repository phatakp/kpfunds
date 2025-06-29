"use client";

import { useSession } from "@/lib/auth-client";
import { PropsWithChildren } from "react";

export function SignedIn({ children }: PropsWithChildren) {
    const { data } = useSession();
    if (!data?.user.id) return null;
    return <>{children}</>;
}
