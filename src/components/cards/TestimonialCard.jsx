import { Quote, Star } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="group/quote flex h-full flex-col rounded-[24px] border border-line bg-white p-8 transition-all duration-[700ms] ease-editorial hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_28px_60px_-38px_rgba(23,21,37,0.45)]">
      <Quote
        className="size-7 shrink-0 text-pink-soft transition-colors duration-500 group-hover/quote:text-pink"
        aria-hidden="true"
      />

      <blockquote className="mt-6 flex-1 text-[1.0625rem] leading-relaxed text-ink/90">
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
        <span
          aria-hidden="true"
          className="grad-primary grid size-11 shrink-0 place-items-center rounded-full text-[0.8125rem] font-semibold text-white"
        >
          {testimonial.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[0.9375rem] font-semibold text-ink">
            {testimonial.name}
          </span>
          <span className="block truncate text-[0.8125rem] text-muted">
            {testimonial.role}
          </span>
        </span>
        <span className="ml-auto flex shrink-0" aria-label={`${testimonial.rating} out of 5`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-pink text-pink"
              strokeWidth={0}
              aria-hidden="true"
            />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
