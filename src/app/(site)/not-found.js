import { robotsTag } from '@/lib/seo';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import GradientBlob from '@/components/ui/GradientBlob';

export const metadata = {
  title: 'Page not found',
  robots: robotsTag(true),
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden py-32">
      <GradientBlob
        tone="lavender"
        size={620}
        blur={120}
        drift
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80"
      />

      <Container size="narrow" className="text-center">
        <p className="eyebrow">Error 404</p>

        <h1 className="text-hero mt-7 text-ink">
          This page took
          <br />a <span className="grad-text">different path.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-md text-[1.0625rem] leading-relaxed text-muted">
          Fitting, in a way. Nothing lives at this address — but everything
          else is still where you left it.
        </p>

        <div className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/programs" variant="secondary" size="lg">
            Explore programs
          </Button>
        </div>
      </Container>
    </section>
  );
}
