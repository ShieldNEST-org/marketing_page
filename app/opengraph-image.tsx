import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'SHIELDNEST - Secure Crypto Portfolio on Coreum | Tokenization, RWAs, NFTs & Passive Income';
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
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(37, 214, 149, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
          padding: '40px 80px',
        }}
      >
        {/* Logo Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          {/* Shield Icon */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(37, 214, 149, 0.3), rgba(37, 214, 149, 0.1))',
              border: '2px solid rgba(37, 214, 149, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
              boxShadow: '0 0 60px rgba(37, 214, 149, 0.3)',
            }}
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
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
          <span
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            SHIELDNEST
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white' }}>Secure Your</span>
          <span
            style={{
              background: 'linear-gradient(90deg, #25d695, #179b69)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Crypto Portfolio on Coreum
          </span>
        </div>

        {/* Keywords Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          {['Tokenization', 'RWAs', 'NFTs', 'Passive Income', 'Staking', 'DeFi'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#A855F7',
                fontSize: '18px',
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
            gap: '8px',
          }}
        >
          <span style={{ color: '#9CA3AF', fontSize: '24px' }}>🌐</span>
          <span style={{ color: '#25d695', fontSize: '24px', fontWeight: '600' }}>
            shieldnest.org
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

