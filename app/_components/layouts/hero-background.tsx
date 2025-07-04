"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { PropsWithChildren } from "react";

export function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "border-2 border-white/80 backdrop-blur-[2px] dark:border-white/80",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.5)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.6),transparent_70%)]",
                        "dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.7),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

export function LogoBadge() {
    return (
        <motion.div
            custom={0}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1,
                delay: 0.7,
                ease: [0.25, 0.4, 0.25, 1],
            }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/50 px-4 py-1.5 shadow-sm backdrop-blur-sm md:mb-12"
        >
            Logo
            {/* <SiteLogo showText /> */}
        </motion.div>
    );
}

export function PageHeader({
    title1,
    title2,
}: {
    title1: string;
    title2: string;
}) {
    return (
        <motion.div
            custom={1}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1,
                delay: 0.7,
                ease: [0.25, 0.4, 0.25, 1],
            }}
        >
            <h1 className="mx-4 mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:mb-8 md:text-8xl">
                <span className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {title1}
                </span>
                <br />
                <span
                    className={cn(
                        "bg-gradient-to-r from-primary via-primary/90 to-rose-500 bg-clip-text p-4 text-transparent font-pacifico",
                        "font-bold"
                    )}
                >
                    {title2}
                </span>
            </h1>
        </motion.div>
    );
}

export function HeroButtons({ children }: PropsWithChildren) {
    return (
        <motion.div
            custom={3}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1,
                delay: 0.7,
                ease: [0.25, 0.4, 0.25, 1],
            }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
        >
            {children}
        </motion.div>
    );
}

export function HeroDescription({ children }: PropsWithChildren) {
    return (
        <motion.div
            custom={2}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1,
                delay: 0.7,
                ease: [0.25, 0.4, 0.25, 1],
            }}
        >
            <p className="mx-auto mb-10 max-w-xl px-4 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                {children}
            </p>
        </motion.div>
    );
}
