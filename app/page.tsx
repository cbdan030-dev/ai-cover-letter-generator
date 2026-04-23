'use client';

import { useState } from 'react';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [tone, setTone] = useState('professional');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!jobDescription.trim() || !resume.trim()) {
      setError('Please fill in both the job description and your resume.');
      return;
    }

    setLoading(true);
    setError('');
    setCoverLetter('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resume, tone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(coverLetter);
    alert('Cover letter copied to clipboard!');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            AI Cover Letter Generator
          </h1>
          <p className="text-slate-600 text-lg">
            Paste a job description and your resume. Get a tailored cover letter in seconds.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Resume / Background
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text, LinkedIn bio, or a summary of your experience..."
              className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="concise">Concise & Direct</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Generating...' : 'Generate Cover Letter'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {coverLetter && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-slate-900">Your Cover Letter</h2>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg whitespace-pre-wrap text-slate-800 leading-relaxed">
                {coverLetter}
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-8 text-sm text-slate-500">
          Built with Next.js, Tailwind, and Google Gemini · by{' '}
          <a href="https://github.com/cbdan030-dev" className="underline hover:text-slate-700">
            Dan Ceban
          </a>
        </footer>
      </div>
    </main>
  );
}