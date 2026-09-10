import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';
import Button from '@/components/ui/Button';
import BlogCard from '@/components/cards/BlogCard';

export default function BlogPreview({ content, posts = [] }) {
  const shown = posts.slice(0, content?.limit ?? 3);
  return (
    <Section>
      <Container size="wide">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={<HeadlineText text={content.title} />}
          lede={content.lede}
          aside={
            <div className="mt-7">
              <Button href={content.ctaHref ?? '/blog'} variant="secondary">
                {content.ctaLabel}
              </Button>
            </div>
          }
        />

        <div className="mt-16 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {shown.map((post, i) => (
            <Reveal key={post.slug} delay={i * 110} className="h-full">
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
