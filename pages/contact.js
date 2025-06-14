// pages/contact.js
import styles from '../styles/Contact.module.css'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react' // Import useContext
import { ThemeContext } from './_app'

import { db } from '../utils/firebaseConfig'; // Import your Firestore instance
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { theme } = useContext(ThemeContext) // useContext is now imported

  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }
    return () => clearTimeout(timer) // Cleanup the timer
  }, [submitSuccess])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

    const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Add a new document to the "contactMessages" collection
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date() // Add a timestamp
      });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' }); // Clear form on success
    } catch (error) {
      console.error('Error submitting message to Firestore:', error);
      // Set an error state for the user
      setErrors(prev => ({ ...prev, submit: 'Failed to send message. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`${styles.container} ${theme}`}>
      <Head>
        <title>Contact LumenDrop</title>
        <meta name="description" content="Contact our team" />
      </Head>

      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Contact Us</h1>
            <p>Have questions? We love to hear from you!</p>
            {/* Use LegacyBehavior for button like link */}
            <Link href="/" passHref legacyBehavior> 
              <button className={styles.ctaButton} aria-label="Back to Home">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.contactFormSection}>
        <h2>Send us a message</h2>
        {submitSuccess && (
          <div className={styles.successMessage}>
            Thank you! Your message has been sent successfully.
          </div>
        )}
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.error : ''}
              aria-invalid={errors.name ? "true" : "false"} // Accessibility
              aria-describedby={errors.name ? "name-error" : null} // Accessibility
            />
            {errors.name && <span id="name-error" className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error : ''}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : null}
            />
            {errors.email && <span id="email-error" className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message:</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5" 
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? styles.error : ''}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : null}
            />
            {errors.message && <span id="message-error" className={styles.errorMessage}>{errors.message}</span>}
          </div>

          <button 
            type="submit" 
            className={styles.ctaButton}
            disabled={isSubmitting}
            aria-live="polite" // Announce submission status to screen readers
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>

      <section className={styles.features}> {/* Renamed from 'section' for clarity */}
        <div className={styles.feature}>
          <h3>📧 Email</h3>
          <p>support@lumendrop.com</p>

          <h3>📱 Social Media</h3>
          <p>Twitter: @LumenDrop</p>
          <p>Instagram: @LumenDropApp</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 LumenDrop. Built for smart learners.</p>
      </footer>
    </div>
  )
}