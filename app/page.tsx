// app/page.tsx
'use client'; // Mark this as a client component since we need to access localStorage

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation in Next.js 13

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication in localStorage (can be handled with cookies too)
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // Redirect based on authentication status
    if (isAuthenticated) {
      router.push('/dashboard');  // Redirect to dashboard if logged in
    } else {
      router.push('/login');      // Redirect to login page if not logged in
    }
  }, [router]);

  return (
    <div>
      <h1>Loading...</h1> {/* You can add a loader or spinner here */}
    </div>
  );
};

export default Home;
