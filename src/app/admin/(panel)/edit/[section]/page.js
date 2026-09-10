import { notFound } from 'next/navigation';

import { getSection } from '@/lib/admin/schema';
import { getAllPages, getCollection, getMedia, getSingle } from '@/lib/content';
import SingleEditor from '@/components/admin/SingleEditor';
import CollectionEditor from '@/components/admin/CollectionEditor';
import MediaEditor from '@/components/admin/MediaEditor';
import PageEditor from '@/components/admin/PageEditor';

/**
 * One route serves every editable section. What renders is decided entirely by
 * the schema, so adding a section to `SECTIONS` gives it a working editor with
 * no new page.
 *
 * Always rendered on demand — the gate above reads the session cookie, and an
 * editor needs to see what is in the database right now.
 */
export async function generateMetadata({ params }) {
  const { section: key } = await params;
  const section = getSection(key);
  return { title: section ? `${section.label} · Admin` : 'Admin' };
}

export default async function EditSectionPage({ params }) {
  const { section: key } = await params;
  const section = getSection(key);

  if (!section || section.kind === 'messages') notFound();

  const media = await getMedia();
  // Offered as autocomplete in every image field, so an editor can point at an
  // existing picture instead of re-uploading one.
  const mediaKeys = Object.keys(media ?? {}).sort();

  if (section.kind === 'media') {
    return <MediaEditor initial={media} />;
  }

  if (section.kind === 'pages') {
    const pages = await getAllPages();
    return (
      <PageEditor section={section} initial={pages} mediaKeys={mediaKeys} />
    );
  }

  if (section.kind === 'collection') {
    const rows = await getCollection(section.key);
    return (
      <CollectionEditor
        section={section}
        initial={rows}
        mediaKeys={mediaKeys}
      />
    );
  }

  const values = await getSingle(section.key);
  return (
    <SingleEditor section={section} initial={values} mediaKeys={mediaKeys} />
  );
}
