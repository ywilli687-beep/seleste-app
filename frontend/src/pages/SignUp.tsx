import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--ff-sans)', color: 'var(--text2)', fontSize: '14px', margin: 0 }}>
          Create your free account to get your audit results
        </p>
      </div>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/" />
      <p style={{ fontFamily: 'var(--ff-sans)', color: 'var(--text3)', fontSize: '12px', marginTop: '1.5rem', textAlign: 'center' }}>
        Already have an account? <a href="/sign-in" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</a>
      </p>
    </div>
  )
}
