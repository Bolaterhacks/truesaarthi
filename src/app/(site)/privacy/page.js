import { getPageOrDefault, getSite } from '@/lib/content';
import { pageDocMetadata } from '@/lib/seo';
import LegalPage from '@/components/shared/LegalPage';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/privacy'),
  ]);
  return pageDocMetadata(site, doc);
}

export default async function PrivacyPage() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/privacy'),
  ]);
  return <LegalPage doc={doc.content} site={site} path="/privacy" />;
}
