import { usingDefaultPassword } from '@/lib/admin/auth';
import PasswordForm from '@/components/admin/PasswordForm';
import { Card, Notice, PageTitle } from '@/components/admin/ui';

export const metadata = { title: 'Settings · Admin' };

export default async function SettingsPage() {
  const isDefault = await usingDefaultPassword();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Settings"
        description="Your admin password, and a note on how access works."
      />

      {isDefault ? (
        <Notice tone="warning">
          You are still using the default password. Change it now.
        </Notice>
      ) : null}

      <PasswordForm />

      <Card>
        <h2 className="text-[1.125rem] font-semibold text-ink">
          How access works
        </h2>
        <ul className="mt-3 space-y-2 text-[0.875rem] leading-relaxed text-muted">
          <li>
            Your password is stored hashed, never in plain text, and never sent
            to the browser.
          </li>
          <li>
            Signing in sets a cookie that lasts seven days. Changing your
            password signs out every other device immediately.
          </li>
          <li>
            Because the site uses a single shared password rather than
            individual accounts, Firestore rules cannot tell an admin apart from
            a visitor. See <code>SETUP.md</code> for how to harden this before
            you handle payments or client data.
          </li>
        </ul>
      </Card>
    </div>
  );
}
