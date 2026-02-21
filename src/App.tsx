import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResearchInput } from './components/ResearchInput';
import { InsightDisplay } from './components/InsightDisplay';
import { geminiService, ResearchResult } from './services/gemini';
import { Sparkles, History, Settings, Info } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, urls: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await geminiService.conductResearch(query, urls);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during synthesis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      <div className="atmosphere" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-serif italic tracking-tight">Aura</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-semibold">
              <History size={16} />
              <span className="hidden sm:inline">Archive</span>
            </button>
            <button className="text-white/40 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Hero Section */}
          <AnimatePresence mode="wait">
            {!result && !isLoading && (
              <motion.section
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-8 py-20"
              >
                <div className="space-y-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-[0.9]"
                  >
                    Deep Synthesis. <br />
                    <span className="text-orange-500">Intelligent</span> Insights.
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/40 max-w-xl mx-auto text-lg font-light leading-relaxed"
                  >
                    Aura transforms raw information into structured knowledge. 
                    Ground your research in the live web or specific documents.
                  </motion.p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Search Section */}
          <section className={result ? "mt-0" : "mt-12"}>
            <ResearchInput onSearch={handleSearch} isLoading={isLoading} />
          </section>

          {/* Results Section */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {result && !isLoading && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Research Complete</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>
                
                <InsightDisplay content={result.text} sources={result.sources} />
                
                <div className="flex justify-center">
                  <button 
                    onClick={() => setResult(null)}
                    className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                  >
                    Start New Research
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-8 left-8 z-50">
        <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/40 hover:text-white transition-colors">
          <Info size={18} />
        </button>
      </footer>
    </div>
  );
}
