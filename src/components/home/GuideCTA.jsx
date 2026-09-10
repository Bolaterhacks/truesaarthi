'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { HeadlineText } from '@/components/ui/Headline';
import { submitMessage } from '@/lib/submit';

export default function GuideCTA({ content = {} }) {
  const chapters = content.chapters ?? [];
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [pending, startTransition] = useTransition();

  const onSubmit = (event) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus('error');
      return;
    }

    // Requests land in the same `messages` collection as the contact form,
    // tagged `guide`, so the owner sees them in one inbox.
    startTransition(async () => {
      const result = await submitMessage({ email, kind: 'guide' });
      setStatus(result?.error ? 'error' : 'done');
    });
  };

  return (
    <Section className="bg-lavender">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-[32px] border border-line bg-canvas px-7 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full opacity-70 blur-[90px]"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, rgba(240,138,203,0.45), transparent 68%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 size-[400px] rounded-full opacity-70 blur-[90px]"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, rgba(125,216,247,0.5), transparent 68%)',
            }}
          />

          <div className="relative grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grad-primary h-px w-8 shrink-0"
                />
                {content.eyebrow}
              </p>

              <h2 className="text-title mt-7 text-ink">
                <HeadlineText text={content.title} />
              </h2>

              <p className="measure-wide mt-6 text-[1.0625rem] leading-relaxed text-muted">
                Get the free guide:{' '}
                <span className="font-semibold text-ink">
                  {content.guideName}
                </span>{' '}
                — {content.lede}
              </p>

              {status === 'done' ? (
                <div
                  role="status"
                  className="mt-10 flex items-start gap-4 rounded-2xl border border-line bg-white/70 p-6"
                >
                  <span className="grad-primary mt-0.5 grid size-9 shrink-0 place-items-center rounded-full">
                    <Check className="size-4 text-white" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">
                      Check your inbox.
                    </span>
                    <span className="mt-1 block text-[0.9375rem] text-muted">
                      The guide is on its way to {email}. If it has not arrived
                      in ten minutes, look in promotions.
                    </span>
                  </span>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="mt-10">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <label htmlFor="guide-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="guide-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder={content.placeholder}
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        aria-invalid={status === 'error'}
                        aria-describedby={
                          status === 'error' ? 'guide-email-error' : undefined
                        }
                        className={`w-full rounded-xl border bg-white px-5 py-4 text-[0.9375rem] text-ink placeholder:text-muted/70 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/35 ${
                          status === 'error'
                            ? 'border-pink'
                            : 'border-line focus:border-primary'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={pending}
                      className="group/get disabled:cursor-not-allowed disabled:opacity-60 grad-primary inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[length:200%_100%] bg-[position:0%_0%] px-7 py-4 text-[0.9375rem] font-semibold text-white transition-all duration-500 ease-editorial hover:-translate-y-0.5 hover:bg-[position:100%_0%]"
                    >
                      {pending ? 'Sending…' : content.buttonLabel}
                      <ArrowRight
                        className="size-4 transition-transform duration-500 ease-editorial group-hover/get:translate-x-1"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <p
                    id="guide-email-error"
                    className={`mt-3 text-[0.8125rem] ${
                      status === 'error' ? 'text-pink' : 'text-muted'
                    }`}
                  >
                    {status === 'error'
                      ? 'Please enter a valid email address.'
                      : content.note}
                  </p>
                </form>
              )}
            </div>

            {/* Abstract artwork standing in for the guide cover. */}
            <div className="lg:col-span-5">
              <div className="grad-tri relative mx-auto max-w-[380px] overflow-hidden rounded-[26px] p-8 text-white shadow-[0_30px_70px_-34px_rgba(75,42,173,0.7)] sm:p-10">
                <div
                  aria-hidden="true"
                  className="absolute -right-14 -top-14 size-44 rounded-full bg-white/20 blur-[36px]"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -left-10 size-40 rounded-full bg-white/15 blur-[36px]"
                />

                <Sparkles className="relative size-6" aria-hidden="true" />

                <p className="relative mt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-white/70">
                  {content.coverLabel}
                </p>
                <p className="relative mt-3 font-display text-[1.875rem] leading-tight">
                  {content.coverTitle}
                </p>

                <ul className="relative mt-7 space-y-2.5 border-t border-white/25 pt-6">
                  {chapters.map((chapter, i) => (
                    <li
                      key={chapter}
                      className="flex items-start gap-3 text-[0.8125rem] text-white/85"
                    >
                      <span className="shrink-0 tabular-nums text-white/50">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {chapter}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
