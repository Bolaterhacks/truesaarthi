'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  EyeOff,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

import { deletePageAction, savePageAction } from '@/lib/admin/actions';
import {
  PAGE_META_FIELDS,
  PAGE_SETTINGS_FIELDS,
  PAGE_TEMPLATES,
} from '@/lib/admin/schema';
import Field from './Fields';
import { Button, Notice, PageTitle } from './ui';

const FAQ_FIELD = {
  name: 'faqs',
  label: 'Questions & answers',
  type: 'objects',
  titleField: 'q',
  addLabel: 'Add a question',
  hint: 'Shown on the page, and submitted to Google as an FAQ rich result.',
  fields: [
    { name: 'q', label: 'Question', type: 'text' },
    { name: 'a', label: 'Answer', type: 'textarea', rows: 4 },
  ],
};

const SECTIONS_FIELD = {
  name: 'sections',
  label: 'Page blocks',
  type: 'sections',
};

/** A blank page, ready for the editor to fill in. */
const blankPage = (existingCount) => ({
  label: 'New page',
  path: '/new-page',
  template: 'custom',
  order: existingCount + 1,
  published: false,
  meta: {
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
    indexFollow: true,
  },
  content: { eyebrow: '', title: 'New page', lede: '' },
  faqs: [],
  sections: [],
});

export default function PageEditor({ section, initial, mediaKeys = [] }) {
  const [rows, setRows] = useState(initial ?? []);
  const [editing, setEditing] = useState(null); // { id, values, isNew }
  const [tab, setTab] = useState('content');
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const template = PAGE_TEMPLATES[editing?.values?.template] ?? PAGE_TEMPLATES.custom;

  // Only the custom template renders arbitrary blocks; showing the builder on
  // a built-in page would offer an edit that has nowhere to appear.
  const isCustom = editing?.values?.template === 'custom';

  const tabs = useMemo(
    () =>
      [
        { key: 'content', label: 'Content' },
        isCustom ? { key: 'blocks', label: 'Blocks' } : null,
        { key: 'seo', label: 'Search & sharing' },
        { key: 'faqs', label: 'Questions' },
        { key: 'settings', label: 'Page settings' },
      ].filter(Boolean),
    [isCustom]
  );

  const notify = (result, fallback) =>
    setStatus(
      result?.error
        ? { tone: 'error', text: result.error }
        : { tone: 'success', text: result?.success ?? fallback }
    );

  /* ------------------------------------------------------------- helpers */

  const setValue = (key, next) =>
    setEditing((prev) => ({ ...prev, values: { ...prev.values, [key]: next } }));

  const setNested = (group, key, next) =>
    setEditing((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [group]: { ...(prev.values[group] ?? {}), [key]: next },
      },
    }));

  const open = (row) => {
    setEditing({ id: row.id, values: row, isNew: false });
    setTab('content');
    setStatus(null);
  };

  const startNew = () => {
    setEditing({ id: null, values: blankPage(rows.length), isNew: true });
    setTab('settings');
    setStatus(null);
  };

  /* ------------------------------------------------------------- actions */

  const save = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await savePageAction(editing.id, editing.values);

      if (result?.error) {
        notify(result);
        return;
      }

      const saved = { ...editing.values, id: result.id, path: result.path };
      setRows((prev) =>
        [...prev.filter((row) => row.id !== editing.id), saved].sort(
          (a, b) => (Number(a.order) || 999) - (Number(b.order) || 999)
        )
      );
      // Stay on the page after saving — an editor usually has more to change,
      // and the id may have moved with the URL.
      setEditing({ id: result.id, values: saved, isNew: false });
      notify(result, 'Saved.');
    });
  };

  const remove = (row) => {
    if (
      !window.confirm(
        `Delete “${row.label || row.path}”? The page will stop responding at ${row.path}.`
      )
    ) {
      return;
    }

    setStatus(null);
    startTransition(async () => {
      const result = await deletePageAction(row.id);
      if (!result?.error) {
        setRows((prev) => prev.filter((item) => item.id !== row.id));
        if (editing?.id === row.id) setEditing(null);
      }
      notify(result, 'Deleted.');
    });
  };

  /* -------------------------------------------------------------- editor */

  if (editing) {
    const { values } = editing;

    return (
      <div className="space-y-6">
        <PageTitle
          title={values.label || values.path}
          description={`${template.label} · ${values.path}`}
        >
          <Button variant="secondary" onClick={() => setEditing(null)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            All pages
          </Button>
          <Button onClick={save} disabled={pending}>
            <Save className="size-4" aria-hidden="true" />
            {pending ? 'Saving…' : 'Save page'}
          </Button>
        </PageTitle>

        {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}

        <div className="flex flex-wrap gap-1 border-b border-line">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              aria-current={tab === item.key ? 'true' : undefined}
              className={`-mb-px border-b-2 px-4 py-2.5 text-[0.875rem] font-semibold transition-colors ${
                tab === item.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------------ content */}
        {tab === 'content' ? (
          <div className="space-y-6">
            <Notice>{template.description}</Notice>
            {template.fields.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={values.content?.[field.name]}
                mediaKeys={mediaKeys}
                onChange={(next) => setNested('content', field.name, next)}
              />
            ))}
          </div>
        ) : null}

        {/* ------------------------------------------------------- blocks */}
        {tab === 'blocks' ? (
          <div className="space-y-6">
            <Notice>
              Blocks stack underneath the page heading, in this order. Add as
              many as you need.
            </Notice>
            <Field
              field={SECTIONS_FIELD}
              value={values.sections}
              mediaKeys={mediaKeys}
              onChange={(next) => setValue('sections', next)}
            />
          </div>
        ) : null}

        {/* ---------------------------------------------------------- seo */}
        {tab === 'seo' ? (
          <div className="space-y-6">
            <Notice>
              This is what Google and social networks show. Everything else on
              this screen is what visitors read.
            </Notice>

            <SerpPreview
              title={values.meta?.title || values.label}
              description={values.meta?.description}
              path={values.path}
            />

            {PAGE_META_FIELDS.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={values.meta?.[field.name]}
                mediaKeys={mediaKeys}
                onChange={(next) => setNested('meta', field.name, next)}
              />
            ))}
          </div>
        ) : null}

        {/* --------------------------------------------------------- faqs */}
        {tab === 'faqs' ? (
          <div className="space-y-6">
            <Notice>
              Questions added here appear on this page and are submitted to
              Google as an FAQ rich result. Leave it empty to show none.
            </Notice>
            <Field
              field={FAQ_FIELD}
              value={values.faqs}
              mediaKeys={mediaKeys}
              onChange={(next) => setValue('faqs', next)}
            />
          </div>
        ) : null}

        {/* ----------------------------------------------------- settings */}
        {tab === 'settings' ? (
          <div className="space-y-6">
            {PAGE_TEMPLATES[values.template]?.builtIn ? (
              <Notice tone="warning">
                This is a built-in page. Changing its URL or template will stop
                the matching route from finding it.
              </Notice>
            ) : null}

            {PAGE_SETTINGS_FIELDS.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={values[field.name]}
                mediaKeys={mediaKeys}
                onChange={(next) => setValue(field.name, next)}
              />
            ))}

            {!editing.isNew ? (
              <div className="border-t border-line pt-6">
                <Button variant="danger" onClick={() => remove(values)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete this page
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Button onClick={save} disabled={pending}>
            <Save className="size-4" aria-hidden="true" />
            {pending ? 'Saving…' : 'Save page'}
          </Button>
          <Button variant="secondary" onClick={() => setEditing(null)}>
            Back to all pages
          </Button>
          {!editing.isNew && values.published !== false ? (
            <a
              href={values.path}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-2 text-[0.875rem] font-semibold text-primary"
            >
              View page
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
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
          {section.addLabel}
        </Button>
      </PageTitle>

      {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}

      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {rows.map((row) => {
          const hidden = row.published === false;
          const tpl = PAGE_TEMPLATES[row.template];

          return (
            <li
              key={row.id}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-lavender/40"
            >
              <button
                type="button"
                onClick={() => open(row)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.875rem] font-semibold text-primary">
                    {row.path}
                  </span>
                  {hidden ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lavender px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-muted">
                      <EyeOff className="size-2.5" aria-hidden="true" />
                      Hidden
                    </span>
                  ) : null}
                  {tpl && !tpl.builtIn ? (
                    <span className="rounded-full bg-sky-soft px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-primary-dark">
                      Custom
                    </span>
                  ) : null}
                  {row.faqs?.length ? (
                    <span className="text-[0.6875rem] text-muted">
                      {row.faqs.length} Q&amp;A
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block truncate text-[0.8125rem] text-muted">
                  {row.label}
                  {row.meta?.title ? ` · ${row.meta.title}` : ''}
                </span>
              </button>

              <button
                type="button"
                onClick={() => remove(row)}
                aria-label={`Delete ${row.label ?? row.path}`}
                className="shrink-0 rounded-lg border border-line p-2 text-muted transition-colors hover:border-pink hover:text-pink"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <Notice>
        A page you add here is live at its URL as soon as you publish it. To put
        it in the top menu, add it under <strong>Brand &amp; Contact → Main
        menu</strong>.
      </Notice>
    </div>
  );
}

/** A rough approximation of the Google result, to make length mistakes obvious. */
function SerpPreview({ title, description, path }) {
  const shownTitle = (title || 'Untitled page').slice(0, 70);
  const shownDescription = (description || '').slice(0, 165);

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
        How this looks in Google
      </p>
      <div className="mt-3">
        <p className="truncate text-[0.75rem] text-muted">yoursite.com{path}</p>
        <p className="mt-0.5 truncate text-[1.0625rem] text-[#1a0dab]">
          {shownTitle}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">
          {shownDescription || 'No description set — your brand description will be used.'}
        </p>
      </div>
      <p className="mt-3 text-[0.6875rem] text-muted">
        Title {title?.length ?? 0}/60 · Description {description?.length ?? 0}/155
      </p>
    </div>
  );
}
