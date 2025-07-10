'use client';

import { Button } from '@/components/ui/button';
import { logout } from '@/server/actions/auth.actions';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, LogOutIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useAuthContext } from './auth-provider';

type Props = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export function SignInOutButton({ setOpen }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isLoading } = useAuthContext();

  const { execute, isPending } = useAction(logout, {
    onSettled: () => {
      queryClient.invalidateQueries();
      if (setOpen) setOpen(false);
      router.push('/');
    },
  });

  const handleLogout = () => execute();

  if (isLoading)
    return (
      <Button disabled size={'icon'} variant={'ghost'}>
        <Skeleton className="size-4" />
      </Button>
    );
  if (!user)
    return (
      <Button asChild className="group transition-all" size={'sm'}>
        <Link
          href={'/auth/login'}
          onClick={() => {
            if (setOpen) setOpen(false);
          }}
        >
          Sign In
          <ArrowRight className="size-4 transition-all duration-500 ease-in-out group-hover:block group-hover:animate-in" />
        </Link>
      </Button>
    );

  return (
    <Button
      isLoading={isPending}
      onClick={handleLogout}
      size={setOpen ? 'lg' : 'icon'}
    >
      {setOpen && <span>Sign Out</span>}
      <LogOutIcon />
    </Button>
  );
}
