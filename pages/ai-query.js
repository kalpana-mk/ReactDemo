// pages/ai-query.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext } from 'react';
import { ThemeContext } from './_app';
import styles from '../styles/AIQuery.module.css';
import { db } from '../utils/firebaseConfig'; // Import your Firestore instance
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions

export default function AIQueryPage() {
  const { theme } = useContext(ThemeContext);
  const [topic, setTopic] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAiResponse('');
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong with the AI request.');
      }

      const data = await response.json();
      setAiResponse(data.knowledge);

      // --- NEW: Store AI query and response in Firestore ---
      try {
        await addDoc(collection(db, "aiKnowledgeDrops"), {
          topic: topic,
          response: data.knowledge,
          timestamp: serverTimestamp() // Use Firebase server timestamp
        });
        console.log("AI knowledge drop saved to Firestore!");
      } catch (firestoreError) {
        console.error("Error saving AI knowledge drop to Firestore:", firestoreError);
        // You might want to set a non-blocking error here for the user
        // setError('Generated content, but failed to save to history.');
      }
      // --- END NEW ---

    } catch (err) {
      console.error('Frontend error:', err);
      setError(err.message || 'Failed to get knowledge from AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${theme}`}>
      <Head>
        <title>AI Knowledge Drop - LumenDrop</title>
        <meta name="description" content="Get instant AI-generated knowledge on any topic." />
      </Head>

      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Instant Knowledge</h1>
            <p>Enter any topic and get a quick AI-powered explanation.</p>
            <Link href="/" passHref legacyBehavior>
              <button className={styles.ctaButton} type="button">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.aiQuerySection}>
        <h2>Ask the AI anything!</h2>
        <form onSubmit={handleSubmit} className={styles.queryForm}>
          <div className={styles.formGroup}>
            <label htmlFor="topic-input">Topic:</label>
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Computing, Ancient Rome, Healthy Habits"
              disabled={loading}
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Generating...' : 'Get Knowledge Drop'}
          </button>
        </form>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {aiResponse && (
          <div className={styles.responseCard}>
            <h3>Your Knowledge Drop:</h3>
            <p className={styles.responseText}>{aiResponse}</p>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <p>© 2025 LumenDrop. Powered by AI.</p>
      </footer>
    </div>
  );
}