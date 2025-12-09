import React, { useState } from 'react';
import { generateSEOContent } from '../services/gemini';
import { 
  ChartBarIcon, 
  HashtagIcon, 
  TagIcon, 
  DocumentTextIcon, 
  ClipboardIcon, 
  ArrowPathIcon, 
  CloudArrowUpIcon
} from './Icons';

interface YouTubeToolsProps {
  onUsage: () => void;
}

type ToolType = 'audit' | 'title' | 'optimize' | 'description' | 'hashtags' | 'tags';

export const YouTubeTools: React.FC<YouTubeToolsProps> = ({ onUsage }) => {
  const [activeTab, setActiveTab] = useState<ToolType>('audit');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  
  // Form States
  const [channelUrl, setChannelUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [topic, setTopic] = useState('');

  const handleGenerate = async () => {
    onUsage();
    setLoading(true);
    setResult('');
    
    try {
      let payload: any = {};
      
      switch(activeTab) {
        case 'audit':
          payload = { url: channelUrl };
          break;
        case 'title':
          payload = { keywords };
          break;
        case 'optimize':
          payload = { title: videoTitle, keywords };
          break;
        case 'description':
          payload = { topic, keywords };
          break;
        case 'hashtags':
        case 'tags':
          payload = { topic };
          break;
      }

      const content = await generateSEOContent(activeTab, payload);
      setResult(content);
    } catch (e) {
      console.error(e);
      setResult("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('Copied to clipboard!');
  };

  const tabs: {id: ToolType, label: string, icon: any}[] = [
    { id: 'audit', label: 'Channel Audit', icon: ChartBarIcon },
    { id: 'title', label: 'Gen Title', icon: DocumentTextIcon },
    { id: 'optimize', label: 'Optimize Title', icon: ArrowPathIcon },
    { id: 'description', label: 'Description', icon: DocumentTextIcon },
    { id: 'hashtags', label: 'Hashtags', icon: HashtagIcon },
    { id: 'tags', label: 'Tags', icon: TagIcon },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-xl mt-8">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-900/50 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(''); }}
            className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-brand border-b-2 border-brand bg-brand/5'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-white mb-6">
          {tabs.find(t => t.id === activeTab)?.label}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            
            {activeTab === 'audit' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">YouTube Channel Link or Name</label>
                <input 
                  type="text" 
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@ChannelName"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-brand focus:border-brand outline-none"
                />
              </div>
            )}

            {(activeTab === 'title' || activeTab === 'optimize' || activeTab === 'description') && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Focus Keywords</label>
                <input 
                  type="text" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. wordpress tutorial, seo tips"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-brand focus:border-brand outline-none"
                />
              </div>
            )}

            {activeTab === 'optimize' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Existing Video Title</label>
                <input 
                  type="text" 
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="My video title..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-brand focus:border-brand outline-none"
                />
              </div>
            )}

            {(activeTab === 'description' || activeTab === 'hashtags' || activeTab === 'tags') && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Video Topic</label>
                <textarea 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What is your video about?"
                  className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-brand focus:border-brand outline-none resize-none"
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-semibold text-lg bg-brand hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Analyzing...
                </>
              ) : (
                'Generate Insights'
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 min-h-[300px] relative">
            {result ? (
              <>
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    title="Copy to Clipboard"
                  >
                    <ClipboardIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-brand">
                  <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <CloudArrowUpIcon className="w-12 h-12 mb-3 opacity-20" />
                <p>Results will appear here with AI-estimated search volume.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};