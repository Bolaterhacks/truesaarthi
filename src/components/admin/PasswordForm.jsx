'use client';

import { useActionState } from 'react';
import { KeyRound } from 'lucide-react';

import { changePasswordAction } from '@/lib/admin/actions';
import { Button, Card, Notice, inputClass, labelClass } from './ui';

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    {}
  );

  return (
    <Card>
      <h2 className="text-[1.125rem] font-semibold text-ink">
        Change password
      </h2>

      <form action={formAction} className="mt-5 max-w-sm space-y-4">
        <div>
          <label htmlFor="current" className={labelClass}>
            Current password
          </label>
          <input
            id="current"
            name="current"
            type="password"
            autoComplete="current-password"
            required
            className={`${inputClass} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="next" className={labelClass}>
            New password
          </label>
          <input
            id="next"
            name="next"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={`${inputClass} mt-2`}
          />
          <p className="mt-1 text-[0.75rem] text-muted">
            At least 8 characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirm" className={labelClass}>
            Confirm new password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            className={`${inputClass} mt-2`}
          />
        </div>

        {state?.error ? <Notice tone="error">{state.error}</Notice> : null}
        {state?.success ? (
          <Notice tone="success">{state.success}</Notice>
        ) : null}

        <Button type="submit" disabled={pending}>
          <KeyRound className="size-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Change password'}
        </Button>
      </form>
    </Card>
  );
}
