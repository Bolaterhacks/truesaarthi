import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/lib/admin/auth';
import { getSite } from '@/lib/content';
import { robotsTag } from '@/lib/seo';
import AdminShell from '@/components/admin/AdminShell';

// Inherited by every page in the group — no admin route repeats it.
export const metadata = {
  title: 'Admin',
  robots: robotsTag(true),
};

/**
 * The auth gate for everything under /admin except the login screen, which
 * sits outside this route group precisely so it is not gated by it.
 *
 * Every write action re-checks the session itself — this redirect is about not
 * rendering the UI, not about being the only thing standing in the way.
 */
export default async function PanelLayout({ children }) {
  if (!(await isAuthenticated())) redirect('/admin/login');

  const site = await getSite();
  return <AdminShell siteName={site.name}>{children}</AdminShell>;
}
