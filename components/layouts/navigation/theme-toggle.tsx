'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function handleClick() {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  }

  return (
    <Button
      className="mx-4"
      onClick={handleClick}
      size="icon"
      variant="outline"
    >
      <Sun className="dark:-rotate-90 size-4 rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
