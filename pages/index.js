// pages/index.js
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from './_app'

export default function Home() {
  const [activeTab, setActiveTab] = useState('features')
  const [stats, setStats] = useState({ users: 0, lessons: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme, user } = useContext(ThemeContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const fetchStats = async () => {
      try {
        setTimeout(() => {
          setStats({
            users: 12500,
            lessons: 85000
          })
        }, 1000)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (isMounted) {
      console.log(`Tab changed to: ${activeTab}`)
    }
  }, [activeTab, isMounted])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`container ${theme}`}>
      <Head>
        <title>LumenDrop Pro - Next Gen Microlearning</title>
        <meta name="description" content="AI-powered daily microlearning reinvented" />
        <link rel="icon" type="image/png" href="/ai-learning.png" />
      </Head>

      <header className="new-header">
        <div className="header-content">
          <div className="logo-container">
            <Image
              src="/ai-learning.png"
              alt="LumenDrop Logo"
              width={60}
              height={60}
              className="logo-spin"
              priority
            />
            <h1>LumenDrop<span className="pro-badge">PRO</span></h1>
          </div>
          <button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
          >
            ☰
          </button>
          <nav className={isMenuOpen ? 'open' : ''} id="main-navigation">
            <Link href="/" className="nav-link active">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            <Link href="/ai-query" className="nav-link">AI Knowledge</Link> {/* NEW LINK */}
            {user ? (
              <Link href="/dashboard" className="nav-button">Dashboard</Link>
            ) : (
              <Link href="/login" passHref legacyBehavior>
                <button className="nav-button">Get Started</button>
              </Link>
            )}
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-text">
            <h2>Microlearning <span className="highlight">Reinvented</span></h2>
            <p className="subtitle">Our new AI engine delivers 50% more effective learning in half the time</p>
            <div className="stats-preview">
              <p>Join {stats.users.toLocaleString()}+ users learning from {stats.lessons.toLocaleString()}+ lessons</p>
            </div>
            <div className="cta-container">
              <Link href="/login" passHref legacyBehavior>
                <button className="primary-button">
                  Start Learning Now
                </button>
              </Link>
              <Link href="/ai-query" passHref legacyBehavior>
                <button className="secondary-button">
                  Try AI Demo
                </button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/ai-learning.png"
              alt="Learning Illustration"
              width={500}
              height={500}
              className="float-animation"
              priority
            />
          </div>
        </section>
        <section className="tabs-section">
          <div className="tabs" role="tablist">
            <button
              onClick={() => setActiveTab('features')}
              className={activeTab === 'features' ? 'active' : ''}
              role="tab"
              aria-selected={activeTab === 'features'}
              id="features-tab"
              aria-controls="features-panel"
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={activeTab === 'testimonials' ? 'active' : ''}
              role="tab"
              aria-selected={activeTab === 'testimonials'}
              id="testimonials-tab"
              aria-controls="testimonials-panel"
            >
              User Stories
            </button>
          </div>

          {activeTab === 'features' && (
            <div className="features-grid" role="tabpanel" id="features-panel" aria-labelledby="features-tab">
              <div className="feature-card card-1">
                <div className="feature-icon">✨</div>
                <h3>Smart AI Tutor</h3>
                <p>Adapta to your learning style in real-time</p>
              </div>
              <div className="feature-card card-2">
                <div className="feature-icon">📊</div>
                <h3>Progress Analytics</h3>
                <p>Detailed metrics to track your improvement</p>
              </div>
              <div className="feature-card card-3">
                <div className="feature-icon">🏆</div>
                <h3>Gamification</h3>
                <p>Earn badges and compete on leaderboards</p>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="testimonials" role="tabpanel" id="testimonials-panel" aria-labelledby="testimonials-tab">
              <div className="testimonial">
                <p>This changed how I learn completely!</p>
                <span>- Sarah, Developer</span>
              </div>
              <div className="testimonial">
                <p>I learn more in 5 minutes than in 1 hour before</p>
                <span>- Mark, Student</span>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="new-footer">
        <div className="footer-content">
          <div className="footer-logo">LumenDrop Pro</div>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
          <div className="social-links">
            <span>Follow us:</span>
            <Link href="#">Twitter</Link>
            <Link href="#">LinkedIn</Link>
          </div>
        </div>
        <div className="copyright">
          © 2025 LumenDrop Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  )
}