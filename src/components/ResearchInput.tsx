import React, { useState } from 'react';
import { Search, Link as LinkIcon, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResearchInputProps {
  onSearch: (query: string, urls: string[]) => void;
  isLoading: boolean;
}

export const ResearchInput: React.FC<ResearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput && !urls.includes(urlInput)) {
      setUrls([...urls, urlInput]);
      setUrlInput('');
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, urls);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-orange-500/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative glass-panel p-2 flex items-center gap-2">
          <div className="pl-4 text-white/40">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to explore today?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-4 placeholder:text-white/20"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className={cn(
              "p-3 rounded-xl transition-colors",
              showUrlInput ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <LinkIcon size={20} />
          </button>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-white text-black px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            <span>{isLoading ? 'Synthesizing...' : 'Research'}</span>
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showUrlInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Context URLs</span>
              <span className="text-[10px] text-white/20 italic">Up to 20 URLs supported</span>
            </div>
            
            <form onSubmit={handleAddUrl} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/article"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500/50 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Add
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {urls.map((url, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs group">
                  <span className="max-w-[200px] truncate opacity-60">{url}</span>
                  <button
                    onClick={() => removeUrl(i)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
