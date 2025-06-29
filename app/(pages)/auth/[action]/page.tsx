import { GoogleLogin } from "@/authcomponents/google-login-btn";
import { LoginForm } from "@/authcomponents/login-form";
import { VerifyOTPForm } from "@/authcomponents/verify-otp-form";
import {
    ElegantShape,
    LogoBadge,
    PageHeader,
} from "@/components/layouts/hero-background";
import { cn } from "@/lib/utils";

type AuthPageProps = {
    params: Promise<{ action: "login" | "verify" }>;
    searchParams: Promise<{ email?: string }>;
};

export default async function AuthPage({
    params,
    searchParams,
}: AuthPageProps) {
    const { action } = await params;
    const { email } = await searchParams;

    if (action === "verify" && !email) throw new Error("No Email found");

    return (
        <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background dark:bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-rose-500/20 blur-3xl dark:from-primary/30 dark:to-rose-500/30" />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-indigo-500/70"
                    className="left-[-10%] top-[15%] md:left-[-5%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-rose-400"
                    className="right-[-5%] top-[70%] md:right-[0%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-400"
                    className="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-amber-500/70 dark:from-amber-400/90"
                    className="right-[15%] top-[10%] md:right-[20%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-cyan-500/70 dark:from-cyan-400/90"
                    className="left-[20%] top-[5%] md:left-[25%] md:top-[10%]"
                />
            </div>

            <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <LogoBadge />

                    <PageHeader
                        title1={"Welcome"}
                        title2={action === "login" ? "Login" : "Verify OTP"}
                    />

                    <div className="w-full max-w-sm mx-auto">
                        <div className={cn("flex flex-col gap-6")}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center gap-2"></div>
                                {action === "login" ? (
                                    <LoginForm />
                                ) : (
                                    <VerifyOTPForm email={email!} />
                                )}
                                {action !== "verify" && (
                                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                                            Or
                                        </span>
                                    </div>
                                )}
                                {action !== "verify" && (
                                    <div className="grid w-full">
                                        <GoogleLogin />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 dark:from-black dark:to-black/80" />
        </div>
    );
}
