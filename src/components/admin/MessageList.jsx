'use client';

import { useState, useTransition } from 'react';
import { Check, Mail, Trash2 } from 'lucide-react';

import { deleteMessageAction, markMessageAction } from '@/lib/admin/actions';
import { Button, Notice, PageTitle } from './ui';

const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function MessageList({ initial }) {
  const [messages, setMessages] = useState(initial ?? []);
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState(null);
  const [, startTransition] = useTransition();

  const shown =
    filter === 'unread'
      ? messages.filter((message) => !message.read)
      : filter === 'guide'
        ? messages.filter((message) => message.kind === 'guide')
        : messages;

  const toggleRead = (message) => {
    const read = !message.read;
    setMessages((prev) =>
      prev.map((item) => (item.id === message.id ? { ...item, read } : item))
    );
    startTransition(async () => {
      const result = await markMessageAction(message.id, read);
      if (result?.error) setStatus({ tone: 'error', text: result.error });
    });
  };

  const remove = (message) => {
    if (!window.confirm(`Delete the message from ${message.name || message.email}?`)) {
      return;
    }
    setMessages((prev) => prev.filter((item) => item.id !== message.id));
    startTransition(async () => {
      const result = await deleteMessageAction(message.id);
      if (result?.error) setStatus({ tone: 'error', text: result.error });
    });
  };

  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="space-y-8">
      <PageTitle
        title="Messages"
        description={
          messages.length
            ? `${messages.length} total, ${unread} unread. Contact-form enquiries and free-guide requests both land here.`
            : 'Everything sent through the contact form and the free-guide box lands here.'
        }
      />

      {status ? <Notice tone={status.tone}>{status.text}</Notice> : null}

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: `All (${messages.length})` },
          { key: 'unread', label: `Unread (${unread})` },
          { key: 'guide', label: 'Guide requests' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            aria-pressed={filter === tab.key}
            className={`rounded-lg border px-3.5 py-2 text-[0.8125rem] font-semibold transition-colors ${
              filter === tab.key
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-white text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <Notice>Nothing here.</Notice>
      ) : (
        <ul className="space-y-3">
          {shown.map((message) => (
            <li
              key={message.id}
              className={`rounded-xl border bg-white p-5 ${
                message.read ? 'border-line' : 'border-primary/40'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
                    {message.name || 'Guide request'}
                    {!message.read ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-white">
                        New
                      </span>
                    ) : null}
                    {message.kind === 'guide' ? (
                      <span className="rounded-full bg-lavender px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-primary-dark">
                        Guide
                      </span>
                    ) : null}
                  </p>
                  <a
                    href={`mailto:${message.email}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-[0.8125rem] text-primary hover:underline"
                  >
                    <Mail className="size-3" aria-hidden="true" />
                    {message.email}
                  </a>
                  {message.program ? (
                    <p className="mt-1 text-[0.75rem] uppercase tracking-wide text-muted">
                      Interested in: {message.program}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[0.75rem] text-muted">
                    {formatDate(message.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRead(message)}
                    aria-label={message.read ? 'Mark unread' : 'Mark read'}
                    className={`rounded-lg border p-2 transition-colors ${
                      message.read
                        ? 'border-line text-muted'
                        : 'border-primary text-primary'
                    }`}
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(message)}
                    aria-label="Delete message"
                    className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-pink hover:text-pink"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {message.message ? (
                <p className="mt-4 whitespace-pre-line border-t border-line pt-4 text-[0.9375rem] leading-relaxed text-ink/90">
                  {message.message}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <Button
        as="a"
        href="/admin"
        variant="secondary"
        className="no-underline"
      >
        Back to dashboard
      </Button>
    </div>
  );
}
