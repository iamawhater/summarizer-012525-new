"use client";

import { useState, FormEvent } from 'react';
import { FileText, Loader2, Sparkles, ArrowRight } from 'lucide-react';
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
  
    console.log('Sending request to:', '/api/summarize');
  
    try {
      const response = await fetch(`/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      console.log('Response status:', response.status); 
   
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
      </div>

      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-3 px-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Now powered by advanced AI technology for better summaries</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center">
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6 tracking-tight">
            VideoSynth
          </h1>
          <p className="text-2xl text-gray-600 mb-16">
            Into the insights
          </p>

          {/* Main Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter YouTube video URL"
                    className="w-full px-6 py-4 text-lg rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    required
                  />
                  <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-6 py-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium shadow-lg hover:shadow-xl"
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
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Access</h3>
                <p className="text-gray-600 leading-relaxed">Experience intelligent video summarization instantly</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">Your free all-in-one AI video analysis tool</p>
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
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Video Summary</h2>
                <div className="space-y-4">
                  {summary.split('\n').map((point, index) => (
                    <div key={index} className="flex gap-4 group">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-medium group-hover:bg-blue-100 transition-colors duration-200">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed flex-1">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoSummarizer;