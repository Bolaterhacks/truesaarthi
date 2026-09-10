'use client';

import { useId, useState } from 'react';
import { ChevronDown, GripVertical, Plus, Trash2, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '@/lib/firebase';
import { BLOCK_TYPES, SECTION_TYPES } from '@/lib/admin/schema';
import { Button, hintClass, inputClass, labelClass } from './ui';

/* ---------------------------------------------------------------- helpers */

const setAt = (list, index, value) =>
  list.map((item, i) => (i === index ? value : item));

const moveItem = (list, from, to) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

function FieldShell({ label, hint, htmlFor, children }) {
  return (
    <div>
      {label ? (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
        </label>
      ) : null}
      <div className={label ? 'mt-2' : ''}>{children}</div>
      {hint ? <p className={hintClass}>{hint}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------ image field */

/**
 * Accepts three kinds of value: a key into `settings/media`, a URL or a path
 * under /public, or a fresh Firebase Storage upload. The preview shows
 * whichever it resolves to, so an editor can see what they picked either way.
 */
function ImageField({ label, hint, value, onChange, mediaKeys = [] }) {
  const id = useId();
  const [status, setStatus] = useState(null);
  // A path that 404s renders as an empty box and nothing else, which is how a
  // stale `/hero.jpeg` sat unnoticed behind a live home page. Tracking the
  // load failure turns that silence into a visible warning.
  const [broken, setBroken] = useState(false);
  const isReference = value && !/^(https?:|\/|data:)/.test(value);
  const previewSrc = isReference ? null : value;

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus({ tone: 'error', text: 'That file is not an image.' });
      return;
    }

    setStatus({ tone: 'info', text: 'Uploading…' });
    try {
      // The timestamp prefix keeps two uploads of the same filename apart.
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const path = `uploads/${Date.now()}-${safe}`;
      const snap = await uploadBytes(ref(storage, path), file, {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      });
      setBroken(false);
      onChange(await getDownloadURL(snap.ref));
      setStatus({ tone: 'success', text: 'Uploaded.' });
    } catch (error) {
      setStatus({
        tone: 'error',
        text: `Upload failed: ${error.message}. Check that Storage is enabled and its rules allow writes.`,
      });
    }
  };

  return (
    <FieldShell label={label} hint={hint}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-lavender">
          {previewSrc ? (
            // A plain <img>: the source is arbitrary and next/image would need
            // every possible upload host allow-listed up front.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt=""
              onLoad={() => setBroken(false)}
              onError={() => setBroken(true)}
              className="size-full object-cover"
            />
          ) : (
            <span className="px-1 text-center text-[0.625rem] leading-tight text-muted">
              {value || 'None'}
            </span>
          )}
        </div>

        <div className="min-w-[15rem] flex-1 space-y-2">
          <input
            id={id}
            type="text"
            value={value ?? ''}
            onChange={(event) => {
              setBroken(false);
              onChange(event.target.value);
            }}
            placeholder="Image key, or paste a URL"
            className={inputClass}
            list={`${id}-keys`}
          />
          <datalist id={`${id}-keys`}>
            {mediaKeys.map((key) => (
              <option key={key} value={key} />
            ))}
          </datalist>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[0.8125rem] font-semibold text-ink transition-colors hover:border-primary hover:text-primary">
            <Upload className="size-3.5" aria-hidden="true" />
            Upload an image
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => upload(event.target.files?.[0])}
            />
          </label>

          {broken && !status ? (
            <p className="text-[0.75rem] text-pink">
              This image could not be loaded. Check the path or upload the file
              again.
            </p>
          ) : null}

          {status ? (
            <p
              className={`text-[0.75rem] ${
                status.tone === 'error' ? 'text-pink' : 'text-muted'
              }`}
            >
              {status.text}
            </p>
          ) : null}
        </div>
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------------ list of strings */

function ListField({ label, hint, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  return (
    <FieldShell label={label} hint={hint}>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <textarea
              rows={Math.min(4, Math.max(1, Math.ceil((item?.length ?? 0) / 70)))}
              value={item ?? ''}
              onChange={(event) => onChange(setAt(items, i, event.target.value))}
              className={`${inputClass} resize-y`}
            />
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => onChange(moveItem(items, i, i - 1))}
                disabled={i === 0}
                aria-label="Move up"
                className="rounded border border-line px-1.5 py-0.5 text-[0.625rem] text-muted disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onChange(moveItem(items, i, i + 1))}
                disabled={i === items.length - 1}
                aria-label="Move down"
                className="rounded border border-line px-1.5 py-0.5 text-[0.625rem] text-muted disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                aria-label="Remove"
                className="rounded border border-line px-1.5 py-1 text-pink"
              >
                <Trash2 className="size-3" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="secondary"
        className="mt-3"
        onClick={() => onChange([...items, ''])}
      >
        <Plus className="size-3.5" aria-hidden="true" />
        Add
      </Button>
    </FieldShell>
  );
}

/* ------------------------------------------------------ list of objects */

function ObjectsField({ field, value, onChange, mediaKeys }) {
  const items = Array.isArray(value) ? value : [];
  const [openIndex, setOpenIndex] = useState(null);

  const blank = Object.fromEntries(
    field.fields.map((f) => [f.name, f.type === 'list' ? [] : ''])
  );

  return (
    <FieldShell label={field.label} hint={field.hint}>
      <ul className="space-y-2">
        {items.map((item, i) => {
          const open = openIndex === i;
          const title =
            item?.[field.titleField ?? field.fields[0].name] || `Item ${i + 1}`;

          return (
            <li key={i} className="rounded-lg border border-line bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <GripVertical
                  className="size-4 shrink-0 text-muted/50"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left text-[0.875rem] text-ink"
                >
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{title}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange(moveItem(items, i, i - 1))}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onChange(moveItem(items, i, i + 1))}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(items.filter((_, j) => j !== i));
                    setOpenIndex(null);
                  }}
                  aria-label="Remove"
                  className="rounded border border-line p-1 text-pink"
                >
                  <Trash2 className="size-3" aria-hidden="true" />
                </button>
              </div>

              {open ? (
                <div className="space-y-4 border-t border-line p-4">
                  {field.fields.map((sub) => (
                    <Field
                      key={sub.name}
                      field={sub}
                      value={item?.[sub.name]}
                      mediaKeys={mediaKeys}
                      onChange={(next) =>
                        onChange(setAt(items, i, { ...item, [sub.name]: next }))
                      }
                    />
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <Button
        type="button"
        variant="secondary"
        className="mt-3"
        onClick={() => {
          onChange([...items, blank]);
          setOpenIndex(items.length);
        }}
      >
        <Plus className="size-3.5" aria-hidden="true" />
        {field.addLabel ?? 'Add'}
      </Button>
    </FieldShell>
  );
}

/* ------------------------------------------------------- article blocks */

function BlocksField({ field, value, onChange }) {
  const blocks = Array.isArray(value) ? value : [];

  return (
    <FieldShell
      label={field.label}
      hint="Each block is a typed piece of the article — no HTML, so the typography stays consistent."
    >
      <ul className="space-y-3">
        {blocks.map((block, i) => (
          <li key={i} className="rounded-lg border border-line bg-white p-3">
            <div className="flex items-center gap-2">
              <select
                value={block?.type ?? 'p'}
                onChange={(event) =>
                  onChange(
                    setAt(blocks, i, {
                      ...block,
                      type: event.target.value,
                      // Switching to or from a list swaps text for items.
                      ...(event.target.value === 'list'
                        ? { items: block?.items ?? [], text: undefined }
                        : { text: block?.text ?? '', items: undefined }),
                    })
                  )
                }
                className={`${inputClass} max-w-[13rem] py-1.5 text-[0.8125rem]`}
              >
                {BLOCK_TYPES.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.label}
                  </option>
                ))}
              </select>

              <span className="ml-auto flex gap-1">
                <button
                  type="button"
                  onClick={() => onChange(moveItem(blocks, i, i - 1))}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onChange(moveItem(blocks, i, i + 1))}
                  disabled={i === blocks.length - 1}
                  aria-label="Move down"
                  className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(blocks.filter((_, j) => j !== i))}
                  aria-label="Remove block"
                  className="rounded border border-line p-1 text-pink"
                >
                  <Trash2 className="size-3" aria-hidden="true" />
                </button>
              </span>
            </div>

            <div className="mt-3">
              {block?.type === 'list' ? (
                <ListField
                  value={block.items}
                  onChange={(items) => onChange(setAt(blocks, i, { ...block, items }))}
                />
              ) : (
                <textarea
                  rows={block?.type === 'h2' ? 1 : 4}
                  value={block?.text ?? ''}
                  onChange={(event) =>
                    onChange(setAt(blocks, i, { ...block, text: event.target.value }))
                  }
                  className={`${inputClass} resize-y`}
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="secondary"
        className="mt-3"
        onClick={() => onChange([...blocks, { type: 'p', text: '' }])}
      >
        <Plus className="size-3.5" aria-hidden="true" />
        Add a block
      </Button>
    </FieldShell>
  );
}

/* ------------------------------------------------- custom-page sections */

/**
 * The page builder. Structurally an `objects` list, except each row carries a
 * `type` that decides which fields it shows — so one array can hold a text
 * block, a card grid and an FAQ, and the renderer knows what to do with each.
 */
function SectionsField({ field, value, onChange, mediaKeys }) {
  const rows = Array.isArray(value) ? value : [];
  const [openIndex, setOpenIndex] = useState(null);
  const types = Object.entries(SECTION_TYPES);

  const blankFor = (type) => ({
    type,
    ...Object.fromEntries(
      (SECTION_TYPES[type]?.fields ?? []).map((f) => [
        f.name,
        f.type === 'list' || f.type === 'objects' ? [] : '',
      ])
    ),
  });

  return (
    <FieldShell
      label={field.label}
      hint="Blocks stack down the page in this order."
    >
      <ul className="space-y-2">
        {rows.map((row, i) => {
          const spec = SECTION_TYPES[row?.type];
          const open = openIndex === i;
          const label = spec?.label ?? 'Unknown block';
          const title = row?.title || row?.eyebrow || label;

          return (
            <li key={i} className="rounded-lg border border-line bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <GripVertical
                  className="size-4 shrink-0 text-muted/50"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate text-[0.875rem] text-ink">
                    {title}
                  </span>
                  <span className="shrink-0 rounded-full bg-lavender px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-primary-dark">
                    {label}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange(moveItem(rows, i, i - 1))}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onChange(moveItem(rows, i, i + 1))}
                  disabled={i === rows.length - 1}
                  aria-label="Move down"
                  className="rounded border border-line px-1.5 text-[0.625rem] text-muted disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(rows.filter((_, j) => j !== i));
                    setOpenIndex(null);
                  }}
                  aria-label="Remove block"
                  className="rounded border border-line p-1 text-pink"
                >
                  <Trash2 className="size-3" aria-hidden="true" />
                </button>
              </div>

              {open ? (
                <div className="space-y-4 border-t border-line p-4">
                  {(spec?.fields ?? []).map((sub) => (
                    <Field
                      key={sub.name}
                      field={sub}
                      value={row?.[sub.name]}
                      mediaKeys={mediaKeys}
                      onChange={(next) =>
                        onChange(setAt(rows, i, { ...row, [sub.name]: next }))
                      }
                    />
                  ))}
                  {!spec ? (
                    <p className="text-[0.8125rem] text-pink">
                      This block has an unrecognised type ({String(row?.type)}).
                      Delete it, or change its type in the database.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap gap-2">
        {types.map(([type, spec]) => (
          <Button
            key={type}
            type="button"
            variant="secondary"
            onClick={() => {
              onChange([...rows, blankFor(type)]);
              setOpenIndex(rows.length);
            }}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {spec.label}
          </Button>
        ))}
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------------------ the switch */

export default function Field({ field, value, onChange, mediaKeys = [] }) {
  const id = useId();

  switch (field.type) {
    case 'textarea':
    case 'richtext':
      return (
        <FieldShell label={field.label} hint={field.hint} htmlFor={id}>
          <textarea
            id={id}
            rows={field.rows ?? (field.type === 'richtext' ? 2 : 3)}
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </FieldShell>
      );

    case 'number':
      return (
        <FieldShell label={field.label} hint={field.hint} htmlFor={id}>
          <input
            id={id}
            type="number"
            value={value ?? ''}
            onChange={(event) =>
              onChange(event.target.value === '' ? '' : Number(event.target.value))
            }
            className={inputClass}
          />
        </FieldShell>
      );

    case 'boolean':
      return (
        <FieldShell hint={field.hint}>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white px-3.5 py-3">
            <input
              type="checkbox"
              // A switch may declare `default: true`, which is what a document
              // that has never stored the field shows. Without it a field added
              // to the schema later would read as off on every existing row —
              // for `indexFollow` that would silently deindex the whole site.
              checked={
                value === undefined || value === null
                  ? field.default === true
                  : Boolean(value)
              }
              onChange={(event) => onChange(event.target.checked)}
              className="size-4 accent-[var(--color-primary)]"
            />
            <span className="text-[0.875rem] text-ink">{field.label}</span>
          </label>
        </FieldShell>
      );

    case 'select':
      return (
        <FieldShell label={field.label} hint={field.hint} htmlFor={id}>
          <select
            id={id}
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FieldShell>
      );

    case 'date':
    case 'datetime':
      return (
        <FieldShell label={field.label} hint={field.hint} htmlFor={id}>
          <input
            id={id}
            type="text"
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder={
              field.type === 'date' ? '2026-09-18' : '2026-09-18T19:00:00+05:30'
            }
            className={inputClass}
          />
        </FieldShell>
      );

    case 'image':
      return (
        <ImageField
          label={field.label}
          hint={field.hint}
          value={value}
          onChange={onChange}
          mediaKeys={mediaKeys}
        />
      );

    case 'list':
      return (
        <ListField
          label={field.label}
          hint={field.hint}
          value={value}
          onChange={onChange}
        />
      );

    case 'objects':
      return (
        <ObjectsField
          field={field}
          value={value}
          onChange={onChange}
          mediaKeys={mediaKeys}
        />
      );

    case 'blocks':
      return <BlocksField field={field} value={value} onChange={onChange} />;

    case 'sections':
      return (
        <SectionsField
          field={field}
          value={value}
          onChange={onChange}
          mediaKeys={mediaKeys}
        />
      );

    case 'group':
      return (
        <fieldset className="rounded-lg border border-line bg-lavender/30 p-4">
          <legend className="px-1.5 text-[0.8125rem] font-semibold text-ink">
            {field.label}
          </legend>
          <div
            className={
              field.inline
                ? 'grid gap-4 sm:grid-cols-2'
                : 'space-y-4'
            }
          >
            {field.fields.map((sub) => (
              <Field
                key={sub.name}
                field={sub}
                value={value?.[sub.name]}
                mediaKeys={mediaKeys}
                onChange={(next) => onChange({ ...(value ?? {}), [sub.name]: next })}
              />
            ))}
          </div>
        </fieldset>
      );

    default:
      return (
        <FieldShell label={field.label} hint={field.hint} htmlFor={id}>
          <input
            id={id}
            type="text"
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
        </FieldShell>
      );
  }
}
