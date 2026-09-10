'use client';

import { useState, useTransition } from 'react';
import { Plus, Save } from 'lucide-react';

import { saveSingleAction } from '@/lib/admin/actions';
import Field from './Fields';
import { Button, Notice, PageTitle, inputClass, labelClass } from './ui';

/**
 * `settings/media` is a free-form map rather than a fixed schema — the site
 * refers to images by key, so the editor has to let the owner replace any key
 * and add new ones without a code change.
 */
export default function MediaEditor({ initial }) {
  const [media, setMedia] = useState(initial ?? {});
  const [newKey, setNewKey] = useState('');
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const keys = Object.keys(media).sort();

  const save = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await saveSingleAction('media', media);
      setStatus(
        result?.error
          ? { tone: 'error', text: result.error }
          : { tone: 'success', text: 'Saved. The site is updating now.' }
      );
    });
  };

  const addKey = () => {
    const key = newKey.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (!key) return;
    if (media[key]) {
      setStatus({ tone: 'error', text: `“${key}” already exists.` });
      return;
    }
    setMedia((prev) => ({ ...prev, [key]: { src: '', alt: '' } }));
    setNewKey('');
  };

  return (
    <div className="space-y-8">
      <PageTitle
        title="Images"
        description="Every photograph on the site. Upload a file to replace one — the new image appears everywhere that key is used."
      >
        <Button onClick={save} disabled={pending}>
          <Save className="size-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </PageTitle>

      {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}

      <Notice>
        Alt text describes the picture for screen readers and search engines.
        Write what someone would miss by not seeing it.
      </Notice>

      <div className="space-y-5">
        {keys.map((key) => (
          <div key={key} className="rounded-xl border border-line bg-white p-4">
            <p className="mb-3 font-mono text-[0.75rem] font-semibold text-primary">
              {key}
            </p>
            <div className="space-y-4">
              <Field
                field={{ name: 'src', label: 'Image', type: 'image' }}
                value={media[key]?.src}
                onChange={(src) =>
                  setMedia((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], src },
                  }))
                }
              />
              <Field
                field={{ name: 'alt', label: 'Alt text', type: 'text' }}
                value={media[key]?.alt}
                onChange={(alt) =>
                  setMedia((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], alt },
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-line p-4">
        <label htmlFor="new-media-key" className={labelClass}>
          Add a new image slot
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id="new-media-key"
            value={newKey}
            onChange={(event) => setNewKey(event.target.value)}
            placeholder="e.g. retreatBanner"
            className={`${inputClass} max-w-xs`}
          />
          <Button type="button" variant="secondary" onClick={addKey}>
            <Plus className="size-3.5" aria-hidden="true" />
            Add slot
          </Button>
        </div>
        <p className="mt-2 text-[0.75rem] text-muted">
          Letters and numbers only. Use the key in any image field to point at it.
        </p>
      </div>

      <div className="border-t border-line pt-6">
        <Button onClick={save} disabled={pending}>
          <Save className="size-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
