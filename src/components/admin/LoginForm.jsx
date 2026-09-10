'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/admin/actions';
import { Button, Notice, inputClass, labelClass } from './ui';

export default function LoginForm({ isDefault }) {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form
      action={formAction}
      className="mt-8 space-y-4 rounded-xl border border-line bg-white p-6"
    >
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className={`${inputClass} mt-2`}
        />
      </div>

      <Notice tone="error">{state?.error}</Notice>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Checking…' : 'Sign in'}
      </Button>

      {isDefault ? (
        <Notice tone="warning">
          This site is still on the default password (<code>truesaarthi</code>).
          Change it under Settings as soon as you are in.
        </Notice>
      ) : null}
    </form>
  );
}
