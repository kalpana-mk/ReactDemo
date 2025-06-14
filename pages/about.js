// pages/about.js
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/About.module.css'
import { useState, useEffect, useRef, useContext } from 'react' // Import useContext
import { ThemeContext } from './_app'

export default function About() {
  const [visibleSections, setVisibleSections] = useState([])
  const sectionRefs = useRef([])
  const { theme } = useContext(ThemeContext) // useContext is now imported

  useEffect(() => {
    // Check for IntersectionObserver support on client-side
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setVisibleSections(prev => {
                // Only add if not already present to prevent duplicates and extra renders
                if (!prev.includes(entry.target.id)) {
                  return [...prev, entry.target.id];
                }
                return prev;
              });
            } else {
              // Optional: remove from visibleSections if it leaves view
              setVisibleSections(prev => prev.filter(id => id !== entry.target.id));
            }
          })
        },
        { threshold: 0.1 }
      )
  
      sectionRefs.current.forEach(ref => {
        if (ref) observer.observe(ref)
      })
  
      return () => {
        sectionRefs.current.forEach(ref => {
          if (ref) observer.unobserve(ref)
        })
        observer.disconnect(); // Disconnect the observer completely on unmount
      }
    }
  }, []) // Empty dependency array as observer setup is only once

  const addToRefs = (el, index) => {
    // Only add if el is not null and not already in the array
    if (el && !sectionRefs.current.includes(el)) {
      el.id = `section-${index}`
      sectionRefs.current[index] = el
    }
  }

  return (
    <div className={`${styles.container} ${theme}`}>
      <Head>
        <title>About LumenDrop</title>
        <meta name="description" content="About our AI microlearning platform" />
      </Head>

      <header 
        className={`${styles.hero} ${visibleSections.includes('section-0') ? styles.visible : ''}`}
        ref={el => addToRefs(el, 0)}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>About LumenDrop</h1>
            <p>We are revolutionizing education with bite-sized AI-powered content delivered daily to your inbox or WhatsApp.</p>
            {/* Use LegacyBehavior for button like link */}
            <Link href="/" passHref legacyBehavior> 
              <button className={styles.ctaButton} type="button">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section 
        className={`${styles.features} ${visibleSections.includes('section-1') ? styles.visible : ''}`}
        ref={el => addToRefs(el, 1)}
      >
        <h2>Our Mission</h2>
        <div className={styles.feature}>
          <p>
            LumenDrop was founded in 2025 with the vision of making continuous learning accessible to everyone,
            regardless of their schedule. Our AI-powered platform delivers personalized micro-lessons that fit into your daily routine.
          </p>
        </div>
      </section>


      <footer className={styles.footer}>
        <p>© 2025 LumenDrop. Built for smart learners.</p>
      </footer>
    </div>
  )
}