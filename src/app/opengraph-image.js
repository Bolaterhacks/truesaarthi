import { ImageResponse } from 'next/og';
import { getHomeContent, getSite } from '@/lib/content';
import { plainText } from '@/lib/text';

export const alt = 'Truesaarthi — Life & Leadership Coaching';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Generated rather than shipped as a static file, so the card always matches
 * the brand values in Firestore. Uses ImageResponse's built-in font.
 */
export default async function OpengraphImage() {
  const [site, home] = await Promise.all([getSite(), getHomeContent()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#fcfbff',
          position: 'relative',
        }}
      >
        {/* Decorative gradient orbs, matching the site's blob system. */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              'radial-gradient(circle at 35% 35%, rgba(109,74,255,0.55), rgba(240,138,203,0.28) 55%, rgba(252,251,255,0) 72%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -240,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background:
              'radial-gradient(circle at 40% 40%, rgba(125,216,247,0.55), rgba(252,251,255,0) 70%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 20,
              background: 'linear-gradient(130deg, #4b2aad, #6d4aff, #f08acb)',
            }}
          />
          <div
            style={{
              fontSize: 34,
              color: '#171525',
              letterSpacing: '-0.02em',
            }}
          >
            {site.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.04,
              color: '#171525',
              letterSpacing: '-0.035em',
              maxWidth: 900,
            }}
          >
            {plainText(home.hero?.title)}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: '#6f6a7d',
              maxWidth: 780,
            }}
          >
            {`${site.tagline} with ${site.coach?.name}`}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #e9e4f2',
            paddingTop: 28,
            fontSize: 22,
            color: '#6f6a7d',
          }}
        >
          <div style={{ display: 'flex' }}>{site.coach?.credential}</div>
          <div style={{ display: 'flex' }}>
            {site.url.replace('https://', '')}
          </div>
        </div>
      </div>
    ),
    size
  );
}
