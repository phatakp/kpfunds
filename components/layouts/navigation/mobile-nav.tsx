'use client';

import { useAuthContext } from '@/components/auth/auth-provider';
import { SignInOutButton } from '@/components/auth/sign-out-btn';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function MobileNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuthContext();

  return (
    <div className="md:hidden">
      <Drawer direction="top" onOpenChange={setOpen} open={open}>
        <DrawerTrigger>
          <MenuIcon className="size-4" />
          {/* {isLoading ? (
            <Skeleton className="size-4" />
          ) : (
            <MenuIcon className="size-4" />
          )} */}
        </DrawerTrigger>
        <DrawerContent className="absolute inset-0">
          <DrawerHeader>
            <DrawerTitle>KP Funds</DrawerTitle>
          </DrawerHeader>
          <div className="grid w-full place-items-center gap-12 py-12">
            <Link
              className={cn(
                'mx-auto font-bold text-4xl',
                path.includes('ganpati') && 'text-primary'
              )}
              href={`/events/ganpati/${new Date().getFullYear()}`}
              onClick={() => setOpen(false)}
            >
              Ganpati
            </Link>

            <Link
              className={cn(
                'mx-auto font-bold text-4xl',
                path.includes('annadaan') && 'text-primary'
              )}
              href={`/events/annadaan/${new Date().getFullYear()}`}
              onClick={() => setOpen(false)}
            >
              Annadaan
            </Link>

            <Link
              className={cn(
                'mx-auto font-bold text-4xl',
                path === '/temple' && 'text-primary'
              )}
              href={'/temple'}
              onClick={() => setOpen(false)}
            >
              Temple
            </Link>

            {profile?.is_admin && (
              <Link
                className={cn(
                  'mx-auto font-bold text-4xl',
                  path === '/admin' && 'text-primary'
                )}
                href={'/admin'}
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
            )}

            <SignInOutButton setOpen={setOpen} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
