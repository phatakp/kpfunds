'use client';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title1,
  title2,
}: {
  title1: string;
  title2: string;
}) {
  return (
    <div>
      <h1 className="mx-4 mb-6 font-bold text-2xl tracking-tight sm:text-6xl md:mb-8 md:text-6xl">
        <span className="bg-gradient-to-br from-muted-foreground via-secondary to-foreground bg-clip-text text-transparent">
          {title1}
        </span>
        <br />
        <span
          className={cn(
            'bg-gradient-to-r from-primary via-primary/80 to-rose-500 bg-clip-text p-4 font-pacifico text-transparent',
            'font-bold'
          )}
        >
          {title2}
        </span>
      </h1>
    </div>
  );
}

export function HeroButtons({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center gap-4 sm:flex-row">
      {children}
    </div>
  );
}

export function HeroDescription({ children }: PropsWithChildren) {
  return (
    <div>
      <p className="mx-auto mb-10 max-w-xl px-4 text-base text-muted-foreground leading-relaxed sm:text-lg md:text-xl">
        {children}
      </p>
    </div>
  );
}
