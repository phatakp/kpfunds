import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import Background from './background';

export const DefaultPage = ({ message }: { message: string }) => {
  return (
    <Background>
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <AlertTriangle className="mx-auto h-24 w-24 text-muted-foreground" />

          <div className="space-y-2">
            <h1 className="font-bold text-4xl tracking-tight">{message}</h1>
          </div>

          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button asChild variant={'outline'}>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
};
