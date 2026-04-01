import { SignIn } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg)',
      backgroundImage: 'radial-gradient(circle at top right, rgba(200,169,110,0.05), transparent 400px), radial-gradient(circle at bottom left, rgba(200,169,110,0.03), transparent 400px)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--ff-sans)'
    }}>
      {/* Branding Header */}
      <div style={{ 
        marginBottom: '2.5rem', 
        textAlign: 'center', 
        animation: 'fadeUp 0.8s ease-out' 
      }}>
        <a href="/" style={{ 
          fontFamily: 'var(--ff-display)', 
          fontSize: '2rem', 
          fontWeight: 800, 
          color: 'var(--accent)', 
          textDecoration: 'none',
          display: 'block',
          marginBottom: '0.75rem',
          letterSpacing: '-0.04em'
        }}>
          Seleste
        </a>
        <p style={{ 
          fontFamily: 'var(--ff-sans)', 
          color: 'var(--text2)', 
          fontSize: '11px', 
          fontWeight: 600,
          margin: 0,
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          Intelligence Hub Portal
        </p>
      </div>

      {/* Clerk Widget Container */}
      <div style={{ 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        borderRadius: 'var(--r)',
        overflow: 'hidden',
        animation: 'fadeUp 1s ease-out',
        width: '100%',
        maxWidth: '430px'
      }}>
        <SignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up" 
          fallbackRedirectUrl="/dashboard"
          appearance={{
            baseTheme: dark,
            elements: {
              card: {
                backgroundColor: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r)',
                width: '100%',
                maxWidth: '430px',
                boxShadow: 'none'
              },
              headerTitle: {
                fontFamily: 'var(--ff-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--ink)'
              },
              headerSubtitle: {
                fontFamily: 'var(--ff-sans)',
                color: 'var(--ink-muted)'
              },
              socialButtonsBlockButton: {
                backgroundColor: 'var(--panel-hover)',
                border: '1px solid var(--border)',
                '&:hover': {
                  backgroundColor: 'var(--panel)',
                  borderColor: 'var(--primary)'
                }
              },
              formButtonPrimary: {
                backgroundColor: '#c8a96e',
                color: '#0a0a0f',
                '&:hover': {
                  opacity: 0.9,
                  backgroundColor: '#c8a96e'
                },
                fontFamily: 'var(--ff-sans)',
                fontWeight: 600,
                fontSize: '14px',
                borderRadius: 'var(--rs)'
              },
              formFieldInput: {
                backgroundColor: 'var(--panel-hover)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--rs)',
                color: 'var(--ink)'
              },
              footerActionLink: {
                color: 'var(--primary)',
                '&:hover': {
                  color: 'var(--primary)',
                  opacity: 0.8
                }
              },
              formFieldLabel: {
                color: 'var(--ink-muted)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              },
              dividerLine: {
                backgroundColor: 'var(--border)'
              },
              dividerText: {
                color: 'var(--ink-muted)'
              }
            },
            variables: {
              colorPrimary: '#c8a96e',
              colorBackground: '#111118',
              colorText: '#f4f1ec',
              colorTextSecondary: '#8a857e',
              colorInputBackground: '#161622',
              colorInputText: '#f4f1ec'
            }
          }}
        />
      </div>

      {/* Navigation Footer */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/" style={{ 
          fontSize: '13px', 
          color: 'var(--ink-muted)', 
          textDecoration: 'none',
          fontFamily: 'var(--ff-sans)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'color 0.2s',
          justifyContent: 'center'
        }} onMouseEnter={(e) => e.currentTarget.style.color = '#c8a96e'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-muted)'}>
          ← Back to growth platform
        </a>
      </div>
    </div>
  )
}
