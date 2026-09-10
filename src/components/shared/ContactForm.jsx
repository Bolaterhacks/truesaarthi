'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { submitMessage } from '@/lib/submit';
import { interpolate } from '@/lib/text';

const field =
  'w-full rounded-xl border bg-white px-5 py-3.5 text-[0.9375rem] text-ink placeholder:text-muted/70 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/35';

const label = 'block text-[0.8125rem] font-semibold text-ink';

export default function ContactForm({ programs = [], content = {} }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    // Default to the featured program, falling back to whatever exists.
    program:
      programs.find((p) => p.featured)?.slug ?? programs[0]?.slug ?? 'unsure',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const next = {};
    if (!values.name.trim()) next.name = 'Please tell me your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (values.message.trim().length < 10) {
      next.message = 'A sentence or two is plenty — just not empty.';
    }

    setErrors(next);
    if (Object.keys(next).length) return;

    // The same checks run again on the server; this pass only saves a
    // round trip for the obvious mistakes.
    startTransition(async () => {
      const result = await submitMessage({ ...values, kind: 'contact' });
      if (result?.error) {
        setErrors({ form: result.error });
        return;
      }
      setSent(true);
    });
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-[24px] border border-line bg-white p-10 text-center"
      >
        <span className="grad-primary mx-auto grid size-14 place-items-center rounded-full">
          <Check className="size-6 text-white" aria-hidden="true" />
        </span>
        <h2 className="mt-7 font-display text-[1.75rem] leading-tight text-ink">
          {interpolate(content.successTitle, {
            firstName: values.name.split(' ')[0],
          })}
        </h2>
        <p className="measure mx-auto mt-4 text-[0.9375rem] leading-relaxed text-muted">
          {content.successLede}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Alex Moreau"
            value={values.name}
            onChange={set('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`${field} mt-2.5 ${
              errors.name ? 'border-pink' : 'border-line focus:border-primary'
            }`}
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-[0.8125rem] text-pink">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={label}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={set('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`${field} mt-2.5 ${
              errors.email ? 'border-pink' : 'border-line focus:border-primary'
            }`}
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-[0.8125rem] text-pink">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="program" className={label}>
          What are you interested in?
        </label>
        <select
          id="program"
          name="program"
          value={values.program}
          onChange={set('program')}
          className={`${field} mt-2.5 border-line focus:border-primary`}
        >
          {programs.map((program) => (
            <option key={program.slug} value={program.slug}>
              {program.title} — {program.duration}
            </option>
          ))}
          <option value="workshop">A workshop or retreat</option>
          <option value="team">Something for my team</option>
          <option value="unsure">Genuinely not sure yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          What is going on?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="However much or little you want to say. A couple of sentences is plenty to start."
          value={values.message}
          onChange={set('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${field} mt-2.5 resize-y ${
            errors.message ? 'border-pink' : 'border-line focus:border-primary'
          }`}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-[0.8125rem] text-pink">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="group/send grad-primary inline-flex items-center gap-2.5 rounded-xl bg-[length:200%_100%] bg-[position:0%_0%] px-8 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(109,74,255,0.65)] transition-all duration-500 ease-editorial hover:-translate-y-0.5 hover:bg-[position:100%_0%] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Send message'}
          <ArrowRight
            className="size-4 transition-transform duration-500 ease-editorial group-hover/send:translate-x-1"
            aria-hidden="true"
          />
        </button>
        <p className="text-[0.8125rem] text-muted">
          {content.responseNote ?? 'Answered personally, usually within a day.'}
        </p>
      </div>

      {errors.form ? (
        <p role="alert" className="text-[0.875rem] text-pink">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
