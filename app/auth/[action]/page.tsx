import { GoogleLogin } from '@/components/auth/google-login-btn';
import { LoginForm } from '@/components/auth/login-form';
import { VerifyOTPForm } from '@/components/auth/verify-otp-form';
import { cn } from '@/lib/utils';

type AuthPageProps = {
  params: Promise<{ action: 'login' | 'verify' }>;
  searchParams: Promise<{ email?: string }>;
};

export default async function AuthPage({
  params,
  searchParams,
}: AuthPageProps) {
  const { action } = await params;
  const { email } = await searchParams;

  if (action === 'verify' && !email) throw new Error('No Email found');

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex flex-col gap-6">
            <h1 className="font-bold text-2xl">Welcome</h1>
            <h3 className="text-2xl">
              {action === 'login' ? 'Login' : 'Verify OTP'}
            </h3>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className={cn('flex flex-col gap-6')}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2" />
                {action === 'login' ? (
                  <LoginForm />
                ) : (
                  <VerifyOTPForm email={email as string} />
                )}
                {action !== 'verify' && (
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                )}
                {action !== 'verify' && (
                  <div className="grid w-full">
                    <GoogleLogin />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
