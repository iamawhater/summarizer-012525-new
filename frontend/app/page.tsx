"use client";

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { FileText, Loader2, Sparkles, Play, Star, Zap, Mail, Phone, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VideoSummarizer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);

  // Function to validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/).+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate URL before submission
    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/api/summarize`
      : '/api/summarize';
    
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        let errorMessage = data.error || `Failed to summarize video (${response.status})`;
        
        if (response.status === 500) {
          errorMessage = 'Server is currently experiencing issues. Please try again in a few minutes. If the problem persists, ensure your YouTube video URL is correct and accessible.';
        } else if (response.status === 404) {
          errorMessage = 'The video could not be found. Please check the URL and try again.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
        }
        
        throw new Error(errorMessage);
      }

      setSummary(data.summary);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 relative">
      {/* Rest of the JSX remains the same until the form */}
      <main className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-6xl sm:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 mb-6 tracking-tight">
            VideoSynth
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 sm:mb-16 font-light">
            Transform Video Content into Brilliant Insights
          </p>

          <div className="max-w-2xl mx-auto transform hover:scale-102 transition-all duration-300 sm:px-4">
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-50 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your YouTube URL here"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-2xl border-2 border-indigo-100 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12"
                    required
                  />
                  <Play className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 hover:from-indigo-700 hover:via-purple-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg font-medium shadow-xl hover:shadow-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    'Generate Summary'
                  )}
                </button>
              </form>
            </div>
            {/* Rest of the component remains the same */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoSummarizer;