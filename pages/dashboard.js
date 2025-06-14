// pages/dashboard.js
import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './_app'; // Assuming _app.js is in the same directory for context
import { useRouter } from 'next/router';

// You might want to create a Dashboard.module.css for styling later,
// but for now, we can use global styles or inline styles.

export default function DashboardPage() {
  const { theme, user, setUser } = useContext(ThemeContext);
  const router = useRouter();
  const [localUser, setLocalUser] = useState(null); // Local state for user data

  useEffect(() => {
    // Check for user in localStorage on mount
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setLocalUser(JSON.parse(savedUser));
      } else {
        // If no user found, redirect to login page (or home)
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user'); // Clear user from local storage
    }
    setUser(null); // Clear user from context (if _app.js uses it directly)
    router.push('/'); // Redirect to home page
  };

  if (!localUser) {
    // You can render a loading state or nothing while redirecting
    return <div className={`container ${theme}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.5rem', color: 'var(--text-color-light)' }}>
        Loading Dashboard...
    </div>;
  }

  return (
    <div className={`container ${theme}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '40px 20px', textAlign: 'center' }}>
      <Head>
        <title>Dashboard - LumenDrop</title>
        <meta name="description" content="Your personalized LumenDrop dashboard." />
      </Head>

      <header style={{ width: '100%', marginBottom: '40px', background: 'var(--header-bg-light)', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px var(--shadow-light)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--primary)' }}>Welcome to Your Dashboard, {localUser.name}!</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-color-light)' }}>
          {localUser.email}
        </p>
      </header>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '800px', width: '100%', padding: '20px', background: 'var(--card-bg-light)', borderRadius: '15px', boxShadow: '0 5px 15px var(--shadow-light)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--primary)' }}>Your Learning Journey Starts Here!</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: 'var(--text-color-light)' }}>
          This is your personal space where your daily knowledge drops, quizzes, and progress analytics will appear.
          For this assignment, consider this the main hub after login.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/ai-query" passHref legacyBehavior>
            <button style={{
              padding: '12px 25px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Try AI Knowledge Drop Again
            </button>
          </Link>
          <Link href="/" passHref legacyBehavior>
            <button style={{
              padding: '12px 25px',
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Go to Home Page
            </button>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 25px',
              backgroundColor: 'var(--accent)', // Using accent color for logout
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            Log Out
          </button>
        </div>
      </main>

      <footer style={{ width: '100%', marginTop: '40px', padding: '20px', background: 'var(--dark)', color: '#aaa', fontSize: '0.9rem', borderRadius: '10px', boxShadow: '0 -2px 10px var(--shadow-dark)' }}>
        <p>© 2025 LumenDrop. All rights reserved.</p>
      </footer>

      {/* Dark theme specific styles for buttons (using inline for simplicity here) */}
      <style jsx>{`
        .container.dark button {
          background-color: var(--secondary) !important;
          color: var(--text-color-dark) !important;
          border-color: var(--secondary) !important;
        }
        .container.dark button:hover {
          background-color: var(--primary) !important;
          color: white !important;
        }
        .container.dark header {
          background: var(--header-bg-dark);
          box-shadow: 0 2px 10px var(--shadow-dark);
        }
        .container.dark main {
          background: var(--card-bg-dark);
          box-shadow: 0 5px 15px var(--shadow-dark);
        }
        .container.dark footer {
          background: #0f0c29;
          box-shadow: 0 -2px 10px var(--shadow-dark);
        }
        .container.dark h1, .container.dark h2, .container.dark p {
          color: var(--text-color-dark);
        }
        .container.dark button[style*="background-color: transparent"] {
          color: var(--primary) !important;
          border-color: var(--primary) !important;
        }
        .container.dark button[style*="background-color: transparent"]:hover {
          background-color: var(--primary) !important;
          color: white !important;
        }
        .container.dark button[style*="background-color: var(--accent)"] {
          background-color: var(--accent) !important;
          color: white !important;
        }
        .container.dark button[style*="background-color: var(--primary)"] {
            background-color: var(--primary) !important;
            color: white !important;
        }
      `}</style>
    </div>
  );
}