import React, { useState, useEffect } from 'react';
import { ThumbnailGenerator } from './components/ThumbnailGenerator';
import { YouTubeTools } from './components/YouTubeTools';
import { Logo } from './components/Logo';
import { PhotoIcon, ChartBarIcon } from './components/Icons';

type View = 'thumbnail' | 'tools';
type UserStatus = 'guest' | 'free_user' | 'premium';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('thumbnail');
  const [userStatus, setUserStatus] = useState<UserStatus>('guest');
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    // Simulate loading usage from local storage
    const stored = localStorage.getItem('wpistic_usage');
    if (stored) setUsageCount(parseInt(stored, 10));
    
    // Simulate auth state check (in real app, this would be an API call)
    const storedStatus = localStorage.getItem('wpistic_status') as UserStatus;
    if (storedStatus) setUserStatus(storedStatus);
  }, []);

  const handleUsage = () => {
    let limit = 5;
    if (userStatus === 'free_user') limit = 10;
    if (userStatus === 'premium') limit = Infinity;

    if (usageCount >= limit) {
      setShowPaywall(true);
      return;
    }

    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('wpistic_usage', newCount.toString());
  };

  const simulateLogin = () => {
    // This is just for demonstration purposes
    const newStatus = userStatus === 'guest' ? 'free_user' : userStatus === 'free_user' ? 'premium' : 'guest';
    setUserStatus(newStatus);
    localStorage.setItem('wpistic_status', newStatus);
    // Reset usage for demo when switching to premium so they don't get stuck
    if (newStatus === 'premium') setShowPaywall(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0f172a] text-slate-50 relative">
      
      {/* Navigation Bar */}
      <nav className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-white">
                WPistic <span className="text-brand">YouTube</span> Solution
              </span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <button 
                onClick={() => setCurrentView('thumbnail')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'thumbnail' ? 'text-brand bg-brand/10' : 'text-slate-400 hover:text-white'}`}
              >
                Thumbnail Gen
              </button>
              <button 
                onClick={() => setCurrentView('tools')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'tools' ? 'text-brand bg-brand/10' : 'text-slate-400 hover:text-white'}`}
              >
                SEO & Audit Tools
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-500 hidden sm:inline-block">
                {userStatus === 'premium' ? 'Unlimited Access' : `${usageCount} / ${userStatus === 'guest' ? 5 : 10} Uses`}
              </span>
              <button 
                onClick={simulateLogin}
                className="text-xs px-3 py-1.5 border border-slate-700 rounded-full hover:bg-slate-800 text-slate-400"
              >
                Simulate: {userStatus.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {currentView === 'thumbnail' ? 'AI Thumbnail Generator' : 'YouTube SEO Toolkit'}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {currentView === 'thumbnail' 
              ? 'Create high-CTR, professional thumbnails in seconds. Optimized for WordPress and Tech channels.'
              : 'Audit your channel, generate viral titles, and optimize your content strategy with AI.'}
          </p>
        </header>

        {showPaywall ? (
          <div className="max-w-2xl mx-auto bg-slate-800 border border-brand rounded-2xl p-8 text-center shadow-2xl shadow-brand/20">
            <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Logo className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">You've reached your free limit!</h2>
            <p className="text-slate-400 mb-8">
              Unlock unlimited generations, deep channel audits, and advanced SEO tools with our Premium Plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <a 
                 href="https://www.wordpressistic.com/marketplace/free-plan/" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
               >
                 Sign Up (Get 10 Free)
               </a>
               <a 
                 href="https://www.wordpressistic.com/marketplace/all-in-one-youtube-solution/" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover shadow-lg shadow-brand/25 transition-all"
               >
                 Get Unlimited ($9.99/mo)
               </a>
            </div>
          </div>
        ) : (
          <>
            {currentView === 'thumbnail' ? (
              <ThumbnailGenerator onUsage={handleUsage} />
            ) : (
              <YouTubeTools onUsage={handleUsage} />
            )}
          </>
        )}

        {/* SEO Content Section */}
        <section className="mt-24 border-t border-slate-800 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-400">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <PhotoIcon className="w-6 h-6 mr-2 text-brand" />
              Why Use WPistic YouTube Solution?
            </h3>
            <p className="mb-4">
              Growing a YouTube channel requires more than just good videos. It requires high-quality thumbnails that drive clicks and SEO optimization that drives search traffic. Our tool combines the power of Gemini 2.5 AI to provide a comprehensive solution for creators.
            </p>
            <p>
              Whether you need to <strong className="text-slate-200">audit your YouTube channel SEO score</strong>, generate viral <strong className="text-slate-200">video titles</strong>, or find high-volume <strong className="text-slate-200">tags and hashtags</strong>, WPistic has you covered.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2 text-brand" />
              Advanced AI Features
            </h3>
            <ul className="space-y-2 list-disc list-inside">
               <li>AI-Powered Thumbnail Generation with customizable aspect ratios (16:9, 1:1, 4:3).</li>
               <li>Deep Channel Analysis using Google Search grounding.</li>
               <li>Keyword Optimization with estimated Global Search Volume insights.</li>
               <li>Instant Description Writer with hooks and CTAs.</li>
            </ul>
          </div>
        </section>
      </div>

      <footer className="w-full bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-2">Powered by Google Gemini API & WPistic</p>
          <div className="flex justify-center space-x-6 text-sm text-brand">
            <a href="https://wordpressistic.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Home</a>
            <a href="https://www.wordpressistic.com/marketplace/free-plan/" target="_blank" rel="noopener noreferrer" className="hover:underline">Free Plan</a>
            <a href="https://www.wordpressistic.com/marketplace/all-in-one-youtube-solution/" target="_blank" rel="noopener noreferrer" className="hover:underline">Premium Plan</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;