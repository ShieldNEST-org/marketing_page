import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'SHIELDNEST - Secure Crypto Portfolio on Coreum';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0e0e0e',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(37, 214, 149, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
          padding: '40px 80px',
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(37, 214, 149, 0.3), rgba(37, 214, 149, 0.1))',
              border: '3px solid rgba(37, 214, 149, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '32px',
              boxShadow: '0 0 80px rgba(37, 214, 149, 0.4)',
            }}
          >
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z"
                stroke="#25d695"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="#25d695"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-3px',
              }}
            >
              SHIELDNEST
            </span>
            <span style={{ fontSize: '24px', color: '#9CA3AF', marginTop: '-8px' }}>
              Built on Coreum
            </span>
          </div>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: '42px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#E5E7EB' }}>Enterprise-Grade Security for</span>
          <span
            style={{
              background: 'linear-gradient(90deg, #25d695, #179b69, #25d695)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Tokenization • RWAs • NFTs • Passive Income
          </span>
        </div>

        {/* Ecosystem Tags */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          {['Sologenic', 'Solotex', 'Coreum', 'DeFi'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '12px 24px',
                borderRadius: '24px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                color: '#C084FC',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ color: '#25d695', fontSize: '28px', fontWeight: '700' }}>
            shieldnest.org
          </span>
          <span style={{ color: '#6B7280', fontSize: '24px' }}>|</span>
          <span style={{ color: '#A855F7', fontSize: '24px' }}>@shieldnest_org</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

