// pages/login.js
import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';

import styles from '../styles/Login.module.css';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function LoginPage() {
  const contentRef = useRef(null);
  const router = useRouter();

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);

    // --- START: MODIFICATION FOR ASSIGNMENT ---
    // For assignment purposes, simulate successful login by saving a mock user
    // In a real app, this token would be sent to your backend for verification.
    const mockUser = {
      id: 'google_user_123',
      name: 'Demo User',
      email: 'demo.user@example.com',
      profilePic: 'https://i.pravatar.cc/40?img=1', // Placeholder
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    // --- END: MODIFICATION FOR ASSIGNMENT ---

    alert("Sign-in successful (check console for ID token). Redirecting to home!");

    router.push('/'); // Redirect to the home page after successful sign-in
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      setTimeout(() => {
        contentElement.classList.add(styles['is-visible']);
      }, 100);
    }

    const initializeGoogleSignIn = () => {
      if (typeof window !== 'undefined' && window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button-container'),
          {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "pill",
            text: "signin_with",
            logo_alignment: "left",
            width: "280"
          }
        );
      } else {
        setTimeout(initializeGoogleSignIn, 50);
      }
    };

    initializeGoogleSignIn();

    if (typeof document !== 'undefined') {
      const bgVideo = document.querySelector(`.${styles['bg-video']}`);
      if (bgVideo) {
        const preventContextMenu = (e) => e.preventDefault();
        bgVideo.addEventListener('contextmenu', preventContextMenu);
        return () => {
          bgVideo.removeEventListener('contextmenu', preventContextMenu);
        };
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LUMENDROP - Login</title>
        <link rel="icon" type="image/png" href="/assest/logo.png" />
      </Head>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Google GSI client script loaded.');
          if (typeof window !== 'undefined' && window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: handleCredentialResponse,
            });
            window.google.accounts.id.renderButton(
              document.getElementById('google-signin-button-container'),
              {
                theme: "outline",
                size: "large",
                type: "standard",
                shape: "pill",
                text: "signin_with",
                logo_alignment: "left",
                width: "280"
              }
            );
          }
        }}
      />

      <section id="hero" className={styles.hero}>
        <video autoPlay muted loop playsInline className={styles['bg-video']} aria-label="Background video">
          <source src="/background.mp4" type="video/mp4" />
           <source src="/background.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        <div className={`${styles.content}`} ref={contentRef}>
          <h1 className={styles['animated-title']} aria-label="LUMENDROP">
            <span className={styles['title-line-wrapper']}>
              <span className={styles['title-word']}>Unlock Daily Learning with</span>
            </span>
            <span className={styles['title-line-wrapper']}>
              <span className={styles['title-word']}>LUMENDROP!</span>
            </span>
          </h1>
          <p>One Minute. One Lesson. Every Day.</p>

          <div id="google-signin-button-container">
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;