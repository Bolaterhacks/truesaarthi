'use client';

import { useState, useTransition } from 'react';
import { ArrowLeft, Eye, EyeOff, Plus, Save, Trash2 } from 'lucide-react';

import {
  deleteItemAction,
  reorderAction,
  saveItemAction,
} from '@/lib/admin/actions';
import Field from './Fields';
import { Button, Notice, PageTitle } from './ui';

/** A stable-enough id for a row that has not been saved yet. */
const draftId = () => `new-${Date.now()}`;

export default function CollectionEditor({ section, initial, mediaKeys = [] }) {
  const [rows, setRows] = useState(initial ?? []);
  const [editing, setEditing] = useState(null); // { id, values, isNew }
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const notify = (result, fallback) =>
    setStatus(
      result?.error
        ? { tone: 'error', text: result.error }
        : { tone: 'success', text: result?.success ?? fallback }
    );

  /* ------------------------------------------------------------- actions */

  const startNew = () => {
    const defaults = { ...(section.defaults ?? {}) };

    // Dated on the client, on the day the row is actually created — a value
    // baked into the schema would be frozen at the moment the server started.
    const today = new Date().toISOString().slice(0, 10);
    for (const name of section.todayFields ?? []) {
      defaults[name] ??= today;
    }
    // Give the row a unique slug up front so two new rows cannot collide.
    if (section.idField && defaults[section.idField]) {
      defaults[section.idField] = `${defaults[section.idField]}-${Date.now()
        .toString(36)
        .slice(-4)}`;
    }
    setEditing({ id: draftId(), values: defaults, isNew: true });
  };

  const save = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await saveItemAction(
        section.key,
        editing.isNew ? null : editing.id,
        editing.values
      );

      if (result?.error) {
        notify(result);
        return;
      }

      const saved = { id: result.id, ...editing.values };
      setRows((prev) => {
        const without = prev.filter((row) => row.id !== editing.id);
        return [...without, saved].sort(
          (a, b) => (a.order ?? 999) - (b.order ?? 999)
        );
      });
      setEditing(null);
      notify(result, 'Saved.');
    });
  };

  const remove = (id, title) => {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;

    setStatus(null);
    startTransition(async () => {
      const result = await deleteItemAction(section.key, id);
      if (!result?.error) {
        setRows((prev) => prev.filter((row) => row.id !== id));
        if (editing?.id === id) setEditing(null);
      }
      notify(result, 'Deleted.');
    });
  };

  const move = (index, direction) => {
    const to = index + direction;
    if (to < 0 || to >= rows.length) return;

    const next = [...rows];
    const [moved] = next.splice(index, 1);
    next.splice(to, 0, moved);
    // Optimistic: the list reorders immediately and the write follows.
    setRows(next.map((row, i) => ({ ...row, order: i + 1 })));

    startTransition(async () => {
      const result = await reorderAction(
        section.key,
        next.map((row) => row.id)
      );
      if (result?.error) notify(result);
    });
  };

  /* -------------------------------------------------------------- editor */

  if (editing) {
    const title =
      editing.values[section.titleField] ||
      (editing.isNew ? 'New item' : editing.id);

    return (
      <div className="space-y-8">
        <PageTitle title={title} description={`In ${section.label}`}>
          <Button variant="secondary" onClick={() => setEditing(null)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button onClick={save} disabled={pending}>
            <Save className="size-4" aria-hidden="true" />
            {pending ? 'Saving…' : 'Save'}
          </Button>
        </PageTitle>

        {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}

        <div className="space-y-6">
          {section.fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              value={editing.values[field.name]}
              mediaKeys={mediaKeys}
              onChange={(next) =>
                setEditing((prev) => ({
                  ...prev,
                  values: { ...prev.values, [field.name]: next },
                }))
              }
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Button onClick={save} disabled={pending}>
            <Save className="size-4" aria-hidden="true" />
            {pending ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={() => setEditing(null)}>
            Cancel
          </Button>
          {!editing.isNew ? (
            <Button
              variant="danger"
              className="ml-auto"
              onClick={() => remove(editing.id, title)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- list */

  return (
    <div className="space-y-8">
      <PageTitle title={section.label} description={section.description}>
        <Button onClick={startNew}>
          <Plus className="size-4" aria-hidden="true" />
          {section.addLabel ?? 'Add'}
        </Button>
      </PageTitle>

      {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}

      {rows.length === 0 ? (
        <Notice>Nothing here yet. Add the first one.</Notice>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {rows.map((row, i) => {
            const hidden = row.published === false;
            const title = row[section.titleField] || row.id;
            const subtitle = section.subtitleField
              ? row[section.subtitleField]
              : null;

            return (
              <li
                key={row.id}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-lavender/40"
              >
                <div className="flex shrink-0 flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${title} up`}
                    className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === rows.length - 1}
                    aria-label={`Move ${title} down`}
                    className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditing({ id: row.id, values: row, isNew: false })
                  }
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`truncate text-[0.9375rem] font-semibold ${
                        hidden ? 'text-muted' : 'text-ink'
                      }`}
                    >
                      {title}
                    </span>
                    {hidden ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lavender px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-muted">
                        <EyeOff className="size-2.5" aria-hidden="true" />
                        Hidden
                      </span>
                    ) : (
                      <Eye
                        className="size-3 shrink-0 text-muted/50"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {subtitle ? (
                    <span className="mt-0.5 block truncate text-[0.8125rem] text-muted">
                      {subtitle}
                    </span>
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() => remove(row.id, title)}
                  aria-label={`Delete ${title}`}
                  className="shrink-0 rounded-lg border border-line p-2 text-muted transition-colors hover:border-pink hover:text-pink"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
