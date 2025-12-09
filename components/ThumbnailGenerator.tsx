import React, { useState, useCallback } from 'react';
import { generateThumbnail, GeneratedImageResult } from '../services/gemini';
import { ImageUploader } from './ImageUploader';
import { PhotoIcon, ArrowPathIcon, ArrowDownTrayIcon } from './Icons';

// Default prompt based on user request
const BASE_PROMPT_TEMPLATE = `Professional YouTube thumbnail. 
DETAILS: [USER_DESC]
COLORS: Primary [COLOR_1], Secondary [COLOR_2].
STYLE: Clean sans-serif font, glow effects, high contrast, photorealistic style, [ASPECT_RATIO] composition.`;

interface ThumbnailGeneratorProps {
  onUsage: () => void;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ onUsage }) => {
  const [description, setDescription] = useState(`Channel Intro: Bold white text 'EasyTech Tutorial'. Smiling American business owner at laptop with WordPress dashboard and rising graph icons.`);
  const [primaryColor, setPrimaryColor] = useState("#007BFF");
  const [secondaryColor, setSecondaryColor] = useState("#28A745");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  
  const [logoFile, setLogoFile] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const match = base64String.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        setLogoFile({
          mimeType: match[1],
          base64: match[2],
        });
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = async () => {
    if (!description.trim()) return;

    onUsage(); // Trigger usage count check
    setIsGenerating(true);
    setError(null);
    setResult(null);

    // Construct the full prompt
    const fullPrompt = BASE_PROMPT_TEMPLATE
      .replace('[USER_DESC]', description)
      .replace('[COLOR_1]', primaryColor)
      .replace('[COLOR_2]', secondaryColor)
      .replace('[ASPECT_RATIO]', aspectRatio);

    try {
      const response = await generateThumbnail(
        fullPrompt,
        logoFile?.base64,
        logoFile?.mimeType,
        aspectRatio
      );
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to generate thumbnail. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `wpistic-thumbnail-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 md:p-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            
            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Aspect Ratio</label>
                 <select 
                   value={aspectRatio}
                   onChange={(e) => setAspectRatio(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:ring-brand focus:border-brand outline-none"
                 >
                   <option value="16:9">16:9 (YouTube Video)</option>
                   <option value="4:3">4:3 (Standard)</option>
                   <option value="1:1">1:1 (Square/Post)</option>
                 </select>
               </div>
               <div className="flex space-x-2">
                 <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Color</label>
                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                      <input 
                        type="color" 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-none p-0"
                      />
                      <span className="text-xs text-slate-400 font-mono">{primaryColor}</span>
                    </div>
                 </div>
                 <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Secondary</label>
                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                      <input 
                        type="color" 
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer bg-transparent border-none p-0"
                      />
                      <span className="text-xs text-slate-400 font-mono">{secondaryColor}</span>
                    </div>
                 </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Thumbnail Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none transition-all"
                placeholder="Describe your thumbnail idea..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Channel Logo (Optional)
              </label>
              <ImageUploader onFileSelect={handleLogoUpload} selectedFile={!!logoFile} />
              {logoFile && (
                 <button 
                   onClick={() => setLogoFile(null)}
                   className="text-xs text-red-400 mt-2 hover:text-red-300"
                 >
                   Remove logo
                 </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
                className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  isGenerating || !description.trim()
                    ? 'bg-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-brand hover:bg-brand-hover shadow-lg shadow-brand/25'
                }`}
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <PhotoIcon className="-ml-1 mr-3 h-5 w-5" />
                    Generate Thumbnail
                  </>
                )}
              </button>
              
              {result?.imageUrl && !isGenerating && (
                <button
                  onClick={handleGenerate}
                  className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                  title="Regenerate with same settings"
                >
                  <ArrowPathIcon className="h-6 w-6" />
                </button>
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative min-h-[300px] lg:min-h-0">
            {result?.imageUrl ? (
              <div className="relative group w-full h-full flex items-center justify-center bg-black">
                <img
                  src={result.imageUrl}
                  alt="Generated Thumbnail"
                  className="max-w-full max-h-full object-contain shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                 {isGenerating ? (
                   <div className="animate-pulse space-y-4">
                     <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto"></div>
                     <div className="h-4 bg-slate-800 rounded w-3/4 mx-auto"></div>
                     <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto"></div>
                   </div>
                 ) : (
                   <>
                    <PhotoIcon className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-sm">Customize settings and generate your masterpiece.</p>
                   </>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};