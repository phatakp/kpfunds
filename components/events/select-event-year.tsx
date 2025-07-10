'use client';

import type { TEvent, TEventType } from '@/app/types';
import { SelectInput } from '@/components/inputs/select-input';
import { Form } from '@/components/ui/form';
import { customResolver } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

type Props = {
  events: TEvent[] | null | undefined;
  type: TEventType;
  year: number;
};

const formSchema = z.object({
  year: z.string().min(4),
});

export function SelectEventYear({ events, type, year }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: customResolver(formSchema),
    defaultValues: {
      year: year.toString(),
    },
  });

  if (!events?.length)
    return (
      <div className="flex w-full items-center capitalize">
        No {type} Events created yet!
      </div>
    );

  const yearOptions = events?.map((e) => ({
    label: String(e.year),
    value: String(e.year),
  }));

  const handleChange = (val: string) => {
    if (type === 'annadaan') router.push(`/events/annadaan/${val}`);
    else router.push(`/events/ganpati/${val}`);
  };

  return (
    <div className="my-4 flex items-center gap-4">
      <Form {...form}>
        <form>
          <SelectInput
            handleChange={handleChange}
            label="Year"
            options={yearOptions ?? []}
            register={form.register('year')}
          />
        </form>
      </Form>
    </div>
  );
}
