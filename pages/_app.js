// pages/_app.js
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useState, createContext } from 'react';
import { Analytics } from '@vercel/analytics/react'; // Correctly imported

// Create theme context
export const ThemeContext = createContext();

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user session
  useEffect(() => {
    // Ensure localStorage is only accessed on the client-side
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log(`Mapsd to: ${url}`);
      // Vercel Analytics will handle tracking automatically once the component is rendered.
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]); // `router.events` is stable, but good to include

  // Theme effect
  useEffect(() => {
    // Ensure document is only accessed on the client-side
    if (typeof document !== 'undefined') {
      document.body.className = theme;
      // Remove any existing login-page-body class before conditionally adding it
      document.body.classList.remove('login-page-body'); 
      if (router.pathname === '/login') {
        document.body.classList.add('login-page-body');
      }
    }
    // No specific cleanup needed here for the `className = theme` part,
    // as it's directly set and will be overwritten on next render or route change.
    // The cleanup for login-page-body is important if you navigate away from /login.
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('login-page-body');
      }
    };
  }, [theme, router.pathname]); // Depend on theme and pathname

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, user, setUser }}>
      <Component {...pageProps} />
      <Analytics /> {/* <-- This is the missing line to render the component */}
    </ThemeContext.Provider>
  );
}
