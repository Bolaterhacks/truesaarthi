import { getPageOrDefault, getSite } from '@/lib/content';
import { pageDocMetadata } from '@/lib/seo';
import LegalPage from '@/components/shared/LegalPage';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/terms'),
  ]);
  return pageDocMetadata(site, doc);
}

export default async function TermsPage() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/terms'),
  ]);
  return <LegalPage doc={doc.content} site={site} path="/terms" />;
}
