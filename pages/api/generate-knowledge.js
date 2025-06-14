// pages/api/generate-knowledge.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({ error: 'Topic is required and must be a non-empty string.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide a brief, engaging, one-minute knowledge drop on the following topic. Focus on core concepts and keep it to 2-3 sentences:\n\nTopic: ${topic}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const knowledge = response.text();

    res.status(200).json({ knowledge });

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate knowledge from Gemini. Please try again later.', details: error.message });
  }
}