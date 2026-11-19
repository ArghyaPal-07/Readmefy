import { ImageResponse } from 'next/og';
import ReadmefyLogo from '@/components/ReadmefyLogo';

export const runtime = 'edge';

export const alt = 'Readmefy — Build in the Studio';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #07080a 0%, #0d0f14 50%, #07080a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#1f2229 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.3,
            display: 'flex',
          }}
        />

        {/* Glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '30%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.12)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', marginBottom: '36px' }}>
          <ReadmefyLogo width={140} height={140} />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontFamily: 'sans-serif',
            color: '#ffffff',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
          }}
        >
          Readmefy
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#6b7280',
            marginTop: '18px',
            fontWeight: 400,
            letterSpacing: '-0.01em',
          }}
        >
          Visual drag-and-drop README builder
        </div>

        {/* Bottom pill badges */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '48px',
          }}
        >
          {['Block Editor', 'Templates', 'GitHub Export', 'AI Import'].map((label) => (
            <div
              key={label}
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '8px 20px',
                fontSize: 22,
                color: '#9ca3af',
                fontFamily: 'sans-serif',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
