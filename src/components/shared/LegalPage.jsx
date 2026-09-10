import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import PageHero from '@/components/shared/PageHero';
import { interpolate } from '@/lib/text';

/**
 * Shared shell for the two policy routes. Sections are plain data so the copy
 * stays editable from the admin panel without touching layout, and
 * `{{legalName}}` / `{{email}}` / `{{name}}` fill in from the brand document.
 */
export default function LegalPage({ doc, site, path }) {
  const tokens = {
    name: site?.name,
    legalName: site?.legalName,
    email: site?.email,
    phone: site?.phone,
  };

  return (
    <>
      <PageHero
        eyebrow={doc.eyebrow}
        crumbs={[
          { name: 'Home', href: '/' },
          { name: doc.title, href: path },
        ]}
        title={doc.title}
        lede={`Last updated ${doc.updated}. Written in plain language on purpose — if anything here is unclear, ask and I will rewrite it.`}
      />

      <Section rhythm="tight" className="pt-0">
        <Container size="narrow">
          <div className="mx-auto max-w-[680px]">
            {(doc.sections ?? []).map((section, i) => (
              <Reveal
                key={section.heading ?? i}
                delay={i * 60}
                className="border-t border-line py-9 first:border-t-0 first:pt-0"
              >
                <h2 className="text-[1.5rem] leading-tight text-ink">
                  {section.heading}
                </h2>
                {(section.body ?? []).map((paragraph, j) => (
                  <p
                    key={j}
                    className="mt-4 text-[1.0625rem] leading-relaxed text-muted"
                  >
                    {interpolate(paragraph, tokens)}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
