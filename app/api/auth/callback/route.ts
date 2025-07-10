import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/profile`);
    }
    return NextResponse.redirect(`${origin}/auth/error?error=${error}`);
  }
  return NextResponse.redirect(`${origin}/auth/error?error=${'no_code_found'}`);

  // return the user to an error page with instructions
}
