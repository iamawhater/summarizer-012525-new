"use client";

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { FileText, Loader2, Sparkles, Play, Star, Zap, Mail, Phone, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VideoSummarizer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [qaMode, setQAMode] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|v\/)|youtu\.be\/).+/;
    try {
      new URL(url);
      return youtubeRegex.test(url);
    } catch {
      try {
        const urlWithProtocol = `https://${url}`;
        new URL(urlWithProtocol);
        return youtubeRegex.test(urlWithProtocol);
      } catch {
        return false;
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    setQAMode(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/api/summarize`
      : '/api/summarize';

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url }),
      });

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format. Please try again.');
      }

      // Safely parse JSON
      let data;
      try {
        const textResponse = await response.text();
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        let errorMessage = data.error || `Failed to summarize video (${response.status})`;

        if (response.status === 500) {
          errorMessage = 'Server is currently experiencing issues. Please try again in a few minutes.';
        } else if (response.status === 404) {
          errorMessage = 'The video could not be found. Please check the URL and try again.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        }

        throw new Error(errorMessage);
      }

      setSummary(data.summary);
      setQAMode(true);
    } catch (error: unknown) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (questionCount >= 6) {
      setError('You have reached the maximum number of questions (6) for this session.');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/api/ask`
        : '/api/ask';

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ question, context: summary }),
      });

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format. Please try again.');
      }

      // Safely parse JSON
      let data;
      try {
        const textResponse = await response.text();
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get an answer');
      }

      if (!data.answer) {
        throw new Error('No answer received from server');
      }

      setAnswer(data.answer);
      setQuestionCount((prev) => prev + 1);
      setQuestion('');
    } catch (error: unknown) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (summary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [summary]);

  // Rest of your component remains the same...
  return (
    // Your existing JSX remains unchanged
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 relative">
      {/* Your existing JSX structure remains the same */}
    </div>
  );
};

export default VideoSummarizer;