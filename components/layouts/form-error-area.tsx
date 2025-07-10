'use client';

import { Badge } from '@/components/ui/badge';
import { useFormContext } from 'react-hook-form';

export default function FormErrorArea() {
  const { formState } = useFormContext();
  return (
    <ul className="my-4 flex flex-wrap gap-2">
      {Object.entries(formState.errors).map(([key, val]) => (
        <Badge className="" key={key} variant={'destructive'}>
          <span className="font-semibold capitalize underline underline-offset-2">
            {key}:
          </span>
          <span className="flex-1 truncate">{val?.message as string}</span>
        </Badge>
      ))}
    </ul>
  );
}
