'use client';

import { useAuthContext } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = { title: string; href: string };

export function NavLink({ title, href }: Props) {
  const path = usePathname();
  const { profile } = useAuthContext();

  if (href === '/admin' && !profile?.is_admin) return;

  return (
    <Button
      asChild
      variant={path.includes(title.toLowerCase()) ? 'link' : 'ghost'}
    >
      <Link href={href}>{title}</Link>
    </Button>
  );
}
