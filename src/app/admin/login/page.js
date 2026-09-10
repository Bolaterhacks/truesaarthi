import { redirect } from 'next/navigation';

import { isAuthenticated, usingDefaultPassword } from '@/lib/admin/auth';
import { getSite } from '@/lib/content';
import { robotsTag } from '@/lib/seo';
import LoginForm from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Sign in',
  robots: robotsTag(true),
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin');

  const [site, isDefault] = await Promise.all([
    getSite(),
    usingDefaultPassword(),
  ]);

  return (
    <main className="grid min-h-dvh place-items-center bg-lavender/50 px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span
            aria-hidden="true"
            className="grad-tri mx-auto grid size-12 place-items-center rounded-2xl"
          >
            <span className="size-3 rounded-full bg-white/95" />
          </span>
          <h1 className="mt-6 font-display text-[1.75rem] leading-tight text-ink">
            {site.name} admin
          </h1>
          <p className="mt-2 text-[0.9375rem] text-muted">
            Sign in to manage the site.
          </p>
        </div>

        <LoginForm isDefault={isDefault} />
      </div>
    </main>
  );
}
