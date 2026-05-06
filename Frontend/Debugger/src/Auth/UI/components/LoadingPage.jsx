import React from 'react'

const LoadingPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 50%, #15223c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '20%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '15%',
          right: '10%',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '-2s',
        }}
      />

      {/* Main loading container */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 10,
          maxWidth: 400,
          padding: '40px 20px',
        }}
      >
        {/* Animated logo/icon */}
        <div
          style={{
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}
        >
          {/* Outer rotating ring */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid rgba(56, 189, 248, 0.2)',
              borderTop: '3px solid #38bdf8',
              animation: 'spin 2s linear infinite',
              position: 'relative',
            }}
          >
            {/* Inner rotating ring (opposite direction) */}
            <div
              style={{
                position: 'absolute',
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderBottom: '2px solid #8b5cf6',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'spin-reverse 3s linear infinite',
              }}
            />

            {/* Center dot */}
            <div
              style={{
                position: 'absolute',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: '0 0 12px',
              color: '#f8fafc',
              fontSize: '1.8rem',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            AI Debugger
          </h1>
          <p
            style={{
              margin: 0,
              color: '#38bdf8',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            Loading...
          </p>
        </div>

        {/* Animated dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#38bdf8',
                animation: `bounce 1.4s infinite ease-in-out`,
                animationDelay: `${index * 0.16}s`,
              }}
            />
          ))}
        </div>

        {/* Loading status text */}
        <p
          style={{
            margin: 0,
            color: '#94a3b8',
            fontSize: '0.9rem',
            fontStyle: 'italic',
          }}
        >
          Initializing your debug environment...
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingPage
