import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Report from './pages/Report'
import Agents from './pages/Agents'
import Pricing from './pages/Pricing'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import FAQ from './pages/FAQ'
import Changelog from './pages/Changelog'
import PublicReport from './pages/PublicReport'
import CookieBanner from './components/CookieBanner'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1
    }
  }
})

if (!clerkPubKey) {
  console.warn("Missing Clerk Publishable Key")
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey || ''}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <CookieBanner />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/report/:slug" element={<PublicReport />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/changelog" element={<Changelog />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <>
              <SignedIn><Dashboard /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/agents" element={
            <>
              <SignedIn><Agents /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/history" element={
            <>
              <SignedIn><History /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          <Route path="/report/:id" element={
            <>
              <SignedIn><Report /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </ClerkProvider>
)
}
