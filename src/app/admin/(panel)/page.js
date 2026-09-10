import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { usingDefaultPassword } from '@/lib/admin/auth';
import { getCollection, getMessages, getSite } from '@/lib/content';
import { SECTIONS } from '@/lib/admin/schema';
import SeedPanel from '@/components/admin/SeedPanel';
import { Card, Notice, PageTitle } from '@/components/admin/ui';

const COUNTED = ['page_tb', 'programs', 'events', 'posts'];

export default async function AdminDashboard() {
  const [site, isDefault, messages, ...counts] = await Promise.all([
    getSite(),
    usingDefaultPassword(),
    getMessages(),
    ...COUNTED.map((key) => getCollection(key)),
  ]);

  const unread = messages.filter((message) => !message.read).length;
  // A site that has never been seeded reads entirely from the shipped
  // defaults, which is worth saying plainly rather than looking identical.
  const seeded = Boolean(site.updatedAt);

  return (
    <div className="space-y-8">
      <PageTitle
        title={`${site.name} admin`}
        description="Everything on the public site is edited from here. Changes go live as soon as you save."
      />

      {isDefault ? (
        <Notice tone="warning">
          You are still using the default password. Change it in{' '}
          <Link href="/admin/settings" className="font-semibold underline">
            Settings
          </Link>{' '}
          before anyone else has the link.
        </Notice>
      ) : null}

      {!seeded ? (
        <Notice tone="warning">
          Nothing has been saved to the database yet, so the site is showing its
          built-in starter content. Use <strong>Load starter content</strong>{' '}
          below to copy it into Firestore, then edit it from there.
        </Notice>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COUNTED.map((key, i) => (
          <Link
            key={key}
            href={`/admin/edit/${key}`}
            className="rounded-xl border border-line bg-white p-5 transition-colors hover:border-primary"
          >
            <p className="font-display text-[2rem] leading-none text-ink">
              {counts[i].length}
            </p>
            <p className="mt-2 text-[0.8125rem] text-muted">
              {SECTIONS[key].label}
            </p>
          </Link>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[1.125rem] font-semibold text-ink">Inbox</h2>
            <p className="mt-1 text-[0.875rem] text-muted">
              {messages.length === 0
                ? 'No messages yet.'
                : `${messages.length} message${messages.length === 1 ? '' : 's'}, ${unread} unread.`}
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-primary"
          >
            Open inbox
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Card>

      <div>
        <h2 className="text-[1.125rem] font-semibold text-ink">Quick edits</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {['page_tb', 'site', 'media', 'programs'].map((key) => (
            <Link
              key={key}
              href={`/admin/edit/${key}`}
              className="group flex items-start gap-3 rounded-xl border border-line bg-white p-4 transition-colors hover:border-primary"
            >
              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-semibold text-ink">
                  {SECTIONS[key].label}
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
                  {SECTIONS[key].description}
                </span>
              </span>
              <ArrowRight
                className="ml-auto size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>

      <SeedPanel seeded={seeded} />
    </div>
  );
}
