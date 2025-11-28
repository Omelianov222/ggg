import { redirect } from 'next/navigation';

// When Next.js renders the app/not-found.tsx for 404s, immediately redirect to '/'
export default function NotFound() {
  // Use a client-side redirect via next/navigation
  if (typeof window !== 'undefined') {
    // in client, perform navigation
    window.location.replace('/');
  } else {
    // in server components, use next/navigation redirect
    redirect('/');
  }

  // Render nothing while redirecting
  return null;
}
