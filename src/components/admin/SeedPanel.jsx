'use client';

import { useTransition, useState } from 'react';
import { Database, RotateCcw } from 'lucide-react';

import { seedAction } from '@/lib/admin/actions';
import { Button, Card, Notice } from './ui';

export default function SeedPanel({ seeded }) {
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const run = (overwrite) => {
    if (
      overwrite &&
      !window.confirm(
        'This overwrites every page, program, event and article with the built-in starter content. Anything you have written will be lost. Continue?'
      )
    ) {
      return;
    }

    setStatus(null);
    startTransition(async () => {
      const result = await seedAction(overwrite);
      setStatus(
        result?.error
          ? { tone: 'error', text: result.error }
          : { tone: 'success', text: result.success }
      );
    });
  };

  return (
    <Card>
      <h2 className="text-[1.125rem] font-semibold text-ink">
        Starter content
      </h2>
      <p className="mt-2 max-w-2xl text-[0.875rem] leading-relaxed text-muted">
        The site ships with a full set of written content. Loading it copies
        that into the database so you can edit it here. It only fills in what is
        missing — anything you have already written is kept, so it is safe to
        run again after an update adds new pages or fields.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={() => run(false)} disabled={pending}>
          <Database className="size-4" aria-hidden="true" />
          {pending ? 'Working…' : 'Load starter content'}
        </Button>

        {seeded ? (
          <Button variant="danger" onClick={() => run(true)} disabled={pending}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset everything to defaults
          </Button>
        ) : null}
      </div>

      {status ? (
        <div className="mt-4">
          <Notice tone={status.tone}>{status.text}</Notice>
        </div>
      ) : null}
    </Card>
  );
}
