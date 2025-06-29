import { SignOutButton } from "@/authcomponents/sign-out-btn";
import { SignedIn } from "@/authcomponents/signed-in";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
    return (
        <header className="sticky top-0 inset-x-0 z-[99] bg-transparent p-4 mb-8">
            <nav className="mx-auto max-w-7xl flex items-center justify-between">
                <Link href={"/"}>Logo</Link>
                <div className="lg:flex items-center gap-6 justify-end hidden">
                    <ThemeToggle />
                    <SignedIn>
                        <SignOutButton />
                    </SignedIn>
                </div>
            </nav>
        </header>
    );
}
