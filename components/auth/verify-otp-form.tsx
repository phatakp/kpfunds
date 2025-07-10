'use client';

import { VerifyOTPSchema } from '@/app/schemas';
import { TextOTPInput } from '@/components/inputs/otp-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn, customResolver } from '@/lib/utils';
import { verifyEmailOTP } from '@/server/actions/auth.actions';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function VerifyOTPForm({ email }: { email: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     otp: '',
  //   },
  // });

  // const { executeAsync } = useAction(verifyEmailOTP);

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  // 		await executeAsync({ email,token:values.otp });
  // 		toast.success("Successfully Logged In");
  //     queryClient.invalidateQueries();
  //     router.push('/profile');
  // 	} catch (error: unknown) {
  // 		toast.error(error instanceof Error ? error.message : "An error occurred");
  // 	}

  //   }

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(verifyEmailOTP, customResolver(VerifyOTPSchema), {
      formProps: {
        mode: 'onChange',
        defaultValues: {
          email,
          token: '',
        },
      },
      actionProps: {
        onSuccess: () => {
          queryClient.invalidateQueries();
          toast.success('Successfully logged in');
          resetFormAndAction();
          router.push('/profile');
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
          <TextOTPInput register={form.register('token')} />

          <Button className="w-full" type="submit">
            Verify OTP
          </Button>
        </div>
      </form>
    </Form>
  );
}
