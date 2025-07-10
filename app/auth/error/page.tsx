import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="container mx-auto max-w-screen-lg space-y-8 px-8 py-16">
      <div className="space-y-4">
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <h1 className="font-bold text-3xl">Login Error</h1>
      </div>

      <p className="text-destructive">
        {error === 'account_not_linked'
          ? 'This account is already linked to another sign-in method.'
          : 'Oops! Something went wrong. Please try again.'}
      </p>
    </div>
  );
}
