import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function BlogCard({ post, sizes = '(max-width: 1024px) 88vw, 30vw' }) {
  return (
    <article className="group/post h-full">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-lavender">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[900ms] ease-editorial group-hover/post:scale-[1.05]"
          />
          <div
            aria-hidden="true"
            className="grad-tri absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover/post:opacity-60"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
            {post.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-7">
          <div className="flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.14em] text-muted">
            <time dateTime={post.date}>{post.dateLabel}</time>
            <span aria-hidden="true" className="h-px w-4 bg-line" />
            <span>{post.readingTime}</span>
          </div>

          <h3 className="mt-4 text-[1.375rem] leading-tight text-ink transition-colors duration-300 group-hover/post:text-primary lg:text-[1.5rem]">
            {post.title}
          </h3>

          <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-muted">
            {post.excerpt}
          </p>

          <span className="mt-auto inline-flex items-center gap-2.5 pt-7 text-[0.875rem] font-semibold text-ink">
            Read the article
            <span className="grid size-9 place-items-center rounded-full border border-line transition-all duration-500 ease-editorial group-hover/post:-translate-y-1 group-hover/post:translate-x-1 group-hover/post:border-transparent group-hover/post:bg-primary group-hover/post:text-white">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
