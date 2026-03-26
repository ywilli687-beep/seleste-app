import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  )
}
