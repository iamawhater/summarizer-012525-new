"use client";

import React, { useState, FormEvent } from 'react';
import { FileText, Loader2, Sparkles, ArrowRight, Play, Star, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VideoSummarizer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
      </div>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex items-center justify-center gap-3 text-sm font-medium">
            <Star className="h-5 w-5 text-yellow-300 animate-spin-slow" />
            <span className="text-base">Presented by Alok Dahal</span>
          </div>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 mb-6 tracking-tight">
            VideoSynth
          </h1>
          <p className="text-2xl text-gray-600 mb-16 font-light">
            Transform Video Content into Brilliant Insights
          </p>

          {/* Main Input Section */}
          <div className="max-w-2xl mx-auto transform hover:scale-102 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-50 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your YouTube URL here"
                    pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$"
                    className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-indigo-100 bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pr-12"
                    required
                  />
                  <Play className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-6 py-4 rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 hover:from-indigo-700 hover:via-purple-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium shadow-xl hover:shadow-2xl"
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

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-indigo-50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="rounded-xl bg-indigo-50 p-3 inline-block mb-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Instant analysis powered by cutting-edge AI</p>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="rounded-xl bg-purple-50 p-3 inline-block mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Insights</h3>
                <p className="text-gray-600">Advanced comprehension of video content</p>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-50 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="rounded-xl bg-amber-50 p-3 inline-block mb-4">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Summary</h3>
                <p className="text-gray-600">Comprehensive yet concise breakdowns</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {error && (
            <div className="max-w-2xl mx-auto mt-8">
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {summary && (
            <div className="max-w-3xl mx-auto mt-12">
              <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-50 p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" />
                  Video Summary
                </h2>
                <div className="space-y-4">
                  <ol className="list-decimal list-inside space-y-4">
                    {summary.split('\n').map((point, index) => (
                      <li key={index} className="group">
                        <div className="inline-block ml-2">
                          <p className="text-gray-700 leading-relaxed">
                            {point.replace(/^\d+[\s.-]*/, '').trim()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoSummarizer;