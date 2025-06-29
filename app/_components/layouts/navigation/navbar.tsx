import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

type Props = {};

export function Navbar({}: Props) {
    return (
        <header className="sticky top-0 inset-x-0 z-[99] bg-transparent p-4 mb-8">
            <nav className="mx-auto max-w-7xl flex items-center justify-between">
                <Link href={"/"}>Logo</Link>
                <div className="lg:flex items-center gap-6 justify-end hidden">
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}
