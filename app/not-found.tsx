import Background from '@/components/layouts/background';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Background>
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <FileQuestion className="mx-auto h-24 w-24 text-muted-foreground" />

          <div className="space-y-2">
            <h1 className="font-bold text-4xl tracking-tight">
              Page not found
            </h1>
            <p className="text-muted-foreground">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The
              page might have been moved, deleted, or never existed.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
}
