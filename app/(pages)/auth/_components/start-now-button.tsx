"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function StartNowButton() {
    const { data } = useSession();
    const href = data?.session ? "/" : "/auth/login";

    return (
        <Button asChild size="lg" className="rounded-full">
            <Link href={href}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
    );
}
