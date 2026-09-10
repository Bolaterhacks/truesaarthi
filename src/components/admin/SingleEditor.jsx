'use client';

import { useState, useTransition } from 'react';
import { Save } from 'lucide-react';

import { saveSingleAction } from '@/lib/admin/actions';
import Field from './Fields';
import { Button, Notice, PageTitle } from './ui';

/**
 * Edits one `settings/<key>` document from its schema.
 *
 * The whole document is held in a single state object and written in one go —
 * these are small documents edited by one person, so field-level saving would
 * add moving parts without buying anything.
 */
export default function SingleEditor({ section, initial, mediaKeys = [] }) {
  const [values, setValues] = useState(initial ?? {});
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const save = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await saveSingleAction(section.key, values);
      setStatus(
        result?.error
          ? { tone: 'error', text: result.error }
          : { tone: 'success', text: 'Saved. The site is updating now.' }
      );
    });
  };

  return (
    <div className="space-y-8">
      <PageTitle title={section.label} description={section.description}>
        <Button onClick={save} disabled={pending}>
          <Save className="size-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </PageTitle>

      {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}

      <div className="space-y-6">
        {section.fields.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={values[field.name]}
            mediaKeys={mediaKeys}
            onChange={(next) =>
              setValues((prev) => ({ ...prev, [field.name]: next }))
            }
          />
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <Button onClick={save} disabled={pending}>
          <Save className="size-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
        {status ? (
          <span
            className={`text-[0.8125rem] ${
              status.tone === 'error' ? 'text-pink' : 'text-muted'
            }`}
          >
            {status.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}
