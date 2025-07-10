/** biome-ignore-all assist/source/organizeImports: <no> */
'use client';

import { LoginSchema } from '@/app/schemas';
import { TextInput } from '@/components/inputs/text-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { loginWithEmailOTP } from '@/server/actions/auth.actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function LoginForm() {
  const router = useRouter();

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(loginWithEmailOTP, zodResolver(LoginSchema), {
      formProps: {
        mode: 'onChange',
        defaultValues: {
          email: '',
        },
      },
      actionProps: {
        onSuccess: ({ input }) => {
          toast.success('Check email for OTP');
          resetFormAndAction();
          router.push(`/auth/verify?email=${input.email}`);
        },
        onError: ({ error }) => {
          toast.error(
            error?.validationErrors?.formErrors?.[0] ??
              error?.serverError ??
              error.thrownError?.message ??
              'Could not process request'
          );
        },
      },
    });

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6')}
        onSubmit={handleSubmitWithAction}
      >
        <div className="grid gap-6">
          <TextInput label="Email" register={form.register('email')} />

          <Button
            className="w-full"
            isLoading={form.formState.isSubmitting}
            type="submit"
          >
            Get OTP
          </Button>
        </div>
      </form>
    </Form>
  );
}
