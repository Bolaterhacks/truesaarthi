import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, MapPin, Users } from 'lucide-react';

/**
 * Horizontal editorial row: date block, copy, image, action.
 * Collapses to a stacked card below `sm`.
 */
export default function EventCard({ event }) {
  return (
    <article className="group/event relative border-t border-line">
      <Link
        href={`/events#${event.slug}`}
        id={event.slug}
        className="grid scroll-mt-32 items-center gap-6 py-8 sm:grid-cols-12 sm:gap-8 lg:py-10"
      >
        <span
          aria-hidden="true"
          className="grad-soft pointer-events-none absolute inset-x-0 inset-y-px -z-10 origin-left scale-x-0 transition-transform duration-[700ms] ease-editorial group-hover/event:scale-x-100"
        />

        {/* Date chip */}
        <div className="flex items-baseline gap-3 sm:col-span-2 sm:block">
          <p className="font-display text-[2.75rem] leading-none text-ink transition-colors duration-300 group-hover/event:text-primary">
            {event.day}
          </p>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-muted sm:mt-2">
            {event.month} {event.year}
          </p>
        </div>

        {/* Copy */}
        <div className="min-w-0 sm:col-span-5">
          <h3 className="text-[1.5rem] leading-tight text-ink lg:text-[1.75rem]">
            {event.title}
          </h3>
          <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-muted">
            {event.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {event.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {event.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden="true" />
              {event.seats}
            </span>
          </div>
        </div>

        {/* Image */}
        <div className="sm:col-span-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-lavender">
            <Image
              src={event.image.src}
              alt={event.image.alt}
              fill
              sizes="(max-width: 640px) 88vw, 26vw"
              className="object-cover transition-transform duration-[900ms] ease-editorial group-hover/event:scale-[1.06]"
            />
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between gap-4 sm:col-span-2 sm:flex-col sm:items-end sm:justify-center sm:gap-4">
          <p className="font-display text-[1.5rem] leading-none text-ink">
            {event.price}
          </p>
          <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-ink sm:flex-row-reverse">
            <span className="grid size-10 place-items-center rounded-full border border-line transition-all duration-500 ease-editorial group-hover/event:-translate-y-1 group-hover/event:translate-x-1 group-hover/event:border-transparent group-hover/event:bg-ink group-hover/event:text-white">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
            View event
          </span>
        </div>
      </Link>
    </article>
  );
}
