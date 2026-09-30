import { useState } from 'react';
import { Code, Shuffle, BookOpen, ArrowRight, Check } from 'lucide-react';

export default function ProblemSetup({ onLaunch }: { onLaunch: (config: { mode: string, language: string, topic: string }) => void }) {
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState<'curated' | 'custom' | 'random'>('curated');
  const [topic, setTopic] = useState('list_iteration');

  const languages = [
    { id: 'python', name: 'Python 3' },
    { id: 'javascript', name: 'JavaScript / Node' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'c', name: 'C' },
    { id: 'rust', name: 'Rust' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' }
  ];

  const topics = [
    { id: 'list_iteration', name: 'List Iteration & Indexing' },
    { id: 'mutable_defaults', name: 'Mutable Default Arguments' },
    { id: 'variable_shadowing', name: 'Variable Shadowing' },
    { id: 'equality_identity', name: 'Equality vs Identity (== vs is)' },
    { id: 'scope', name: 'Scope & Global Keyword' }
  ];

  return (
    <div className="flex-col gap-6 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Configure Your <span className="text-gradient">Challenge</span></h2>
        <p className="text-secondary">Select a language and a learning path to get started.</p>
      </div>

      <div className="glass-panel p-8 flex-col gap-8">
        
        {/* Language Selection */}
        <div className="flex-col gap-4">
          <h3 className="text-xl font-bold border-b pb-2 m-0" style={{ borderColor: 'var(--border-color)' }}>
            1. Select Language
          </h3>
          <div className="flex gap-3 flex-wrap">
            {languages.map(lang => (
              <button 
                key={lang.id}
                className={`btn ${language === lang.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setLanguage(lang.id)}
                style={{ padding: '10px 20px', borderRadius: '100px' }}
              >
                {language === lang.id && <Check size={16} />} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex-col gap-4">
          <h3 className="text-xl font-bold border-b pb-2 m-0" style={{ borderColor: 'var(--border-color)' }}>
            2. Choose Learning Mode
          </h3>
          <div className="flex gap-4">
            
            <div 
              className={`glass-card p-6 flex-col items-center justify-center gap-3 cursor-pointer text-center`}
              style={{ flex: 1, borderColor: mode === 'curated' ? 'var(--accent-cyan)' : 'var(--border-color)', backgroundColor: mode === 'curated' ? 'rgba(102, 252, 241, 0.1)' : '' }}
              onClick={() => setMode('curated')}
            >
              <BookOpen size={32} color={mode === 'curated' ? 'var(--accent-cyan)' : 'var(--text-secondary)'} />
              <h4 className="font-bold text-lg m-0">Curated Topic</h4>
              <p className="text-xs text-secondary m-0">Practice specific concepts</p>
            </div>

            <div 
              className={`glass-card p-6 flex-col items-center justify-center gap-3 cursor-pointer text-center`}
              style={{ flex: 1, borderColor: mode === 'custom' ? 'var(--accent-purple)' : 'var(--border-color)', backgroundColor: mode === 'custom' ? 'rgba(199, 125, 255, 0.1)' : '' }}
              onClick={() => setMode('custom')}
            >
              <Code size={32} color={mode === 'custom' ? 'var(--accent-purple)' : 'var(--text-secondary)'} />
              <h4 className="font-bold text-lg m-0">Bring Your Own Code</h4>
              <p className="text-xs text-secondary m-0">Paste a broken assignment</p>
            </div>

            <div 
              className={`glass-card p-6 flex-col items-center justify-center gap-3 cursor-pointer text-center`}
              style={{ flex: 1, borderColor: mode === 'random' ? 'var(--warning)' : 'var(--border-color)', backgroundColor: mode === 'random' ? 'rgba(255, 214, 0, 0.1)' : '' }}
              onClick={() => setMode('random')}
            >
              <Shuffle size={32} color={mode === 'random' ? 'var(--warning)' : 'var(--text-secondary)'} />
              <h4 className="font-bold text-lg m-0">Surprise Me</h4>
              <p className="text-xs text-secondary m-0">Generate a random bug</p>
            </div>

          </div>
        </div>

        {/* Dynamic Context Area */}
        <div className="flex-col gap-4 animate-fade-in" style={{ minHeight: '120px' }}>
          {mode === 'curated' && (
            <>
              <h3 className="text-xl font-bold border-b pb-2 m-0" style={{ borderColor: 'var(--border-color)' }}>
                3. Select Topic
              </h3>
              <select 
                className="p-3 rounded glass-card w-full"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </>
          )}

          {mode === 'custom' && (
            <>
              <h3 className="text-xl font-bold border-b pb-2 m-0" style={{ borderColor: 'var(--border-color)' }}>
                3. Describe Your Problem
              </h3>
              <textarea 
                className="p-3 rounded glass-card w-full"
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                placeholder="What is this code supposed to do? (e.g., 'It should sort the array but it crashes')"
              />
            </>
          )}

          {mode === 'random' && (
            <div className="flex items-center justify-center h-full text-secondary text-sm italic p-6">
              The AI Tutor will dynamically generate a completely random challenge based on your past weaknesses.
            </div>
          )}
        </div>

      </div>

      <div className="flex justify-center mt-2">
        <button className="btn btn-primary pulse-glow" onClick={() => onLaunch({ mode, language, topic })} style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
          Launch Socratic Tutor <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
}
