'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  CalendarDays,
  Compass,
  ExternalLink,
  Feather,
  FileText,
  Home,
  ImageIcon,
  Inbox,
  List,
  LogOut,
  Menu,
  Mic,
  Newspaper,
  Quote,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';

import { SECTIONS, SECTION_GROUPS } from '@/lib/admin/schema';
import { logoutAction } from '@/lib/admin/actions';

/**
 * Icons are looked up by the name stored in the schema rather than imported
 * there, so the schema stays a plain data module usable on the server.
 */
const ICONS = {
  Building2,
  CalendarDays,
  Compass,
  Feather,
  FileText,
  Home,
  ImageIcon,
  Inbox,
  List,
  Mic,
  Newspaper,
  Quote,
  Sparkles,
};

const hrefFor = (section) =>
  section.kind === 'messages'
    ? '/admin/messages'
    : `/admin/edit/${section.key}`;

export default function AdminShell({ siteName, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-7">
      <Link
        href="/admin"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[0.875rem] font-semibold transition-colors ${
          pathname === '/admin'
            ? 'bg-primary text-white'
            : 'text-muted hover:bg-lavender hover:text-ink'
        }`}
      >
        <Home className="size-4 shrink-0" aria-hidden="true" />
        Dashboard
      </Link>

      {SECTION_GROUPS.map((groupName) => {
        const items = Object.values(SECTIONS).filter(
          (section) => section.group === groupName
        );
        if (!items.length) return null;

        return (
          <div key={groupName}>
            <p className="px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted/70">
              {groupName}
            </p>
            <ul className="mt-2 space-y-0.5">
              {items.map((section) => {
                const href = hrefFor(section);
                const active = pathname === href || pathname.startsWith(`${href}/`);
                const Icon = ICONS[section.icon] ?? List;

                return (
                  <li key={section.key}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[0.875rem] transition-colors ${
                        active
                          ? 'bg-primary text-white'
                          : 'text-muted hover:bg-lavender hover:text-ink'
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{section.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div className="border-t border-line pt-5">
        <Link
          href="/admin/settings"
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[0.875rem] transition-colors ${
            pathname === '/admin/settings'
              ? 'bg-primary text-white'
              : 'text-muted hover:bg-lavender hover:text-ink'
          }`}
        >
          <Settings className="size-4 shrink-0" aria-hidden="true" />
          Settings
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[0.875rem] text-muted transition-colors hover:bg-lavender hover:text-ink"
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          View site
        </a>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[0.875rem] text-muted transition-colors hover:bg-lavender hover:text-ink"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-canvas">
      {/* ------------------------------------------------- mobile bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-display text-[1.125rem] text-ink">
          {siteName} admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-lg border border-line text-ink"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="lg:flex">
        {/* --------------------------------------------------- sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-line bg-white lg:block">
          <div className="sticky top-0 max-h-dvh overflow-y-auto p-5">
            <Link
              href="/admin"
              className="mb-8 block font-display text-[1.25rem] leading-tight text-ink"
            >
              {siteName}
              <span className="mt-0.5 block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted">
                Admin panel
              </span>
            </Link>
            {nav}
          </div>
        </aside>

        {/* ---------------------------------------------- mobile drawer */}
        <div
          inert={!open}
          className={`fixed inset-0 z-50 lg:hidden ${
            open ? '' : 'pointer-events-none'
          }`}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className={`absolute inset-0 bg-ink/40 transition-opacity ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-white p-5 transition-transform duration-300 ${
              open ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-[1.25rem] text-ink">
                {siteName}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-9 place-items-center rounded-lg border border-line text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            {nav}
          </div>
        </div>

        {/* ----------------------------------------------------- content */}
        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
