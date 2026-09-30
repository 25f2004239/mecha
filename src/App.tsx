import { useState } from 'react';
import { Terminal, Code2, ArrowLeft } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Challenge from './components/Challenge';
import LearningOutcome from './components/LearningOutcome';
import Verification from './components/Verification';
import ProblemSetup from './components/ProblemSetup';

type AppState = 'dashboard' | 'setup' | 'challenge' | 'learning' | 'verification';

function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [config, setConfig] = useState({ mode: 'curated', language: 'python', topic: 'list_iteration' });
  const [solvedTopic, setSolvedTopic] = useState('list_iteration');

  return (
    <>
      <header className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setAppState('dashboard')}
          >
            <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' }}>
              <Code2 size={24} color="#000" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              CodeMisconception<span className="text-gradient">OS</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <span className="text-sm text-secondary flex items-center gap-2">
              <Terminal size={16} /> Beta v1.0
            </span>
          </div>
        </div>
      </header>

      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
        {appState !== 'dashboard' && (
          <div style={{ marginBottom: '1.5rem', padding: '0 2rem' }}>
            <button 
              onClick={() => {
                const seq: AppState[] = ['dashboard', 'setup', 'challenge', 'learning', 'verification'];
                const idx = seq.indexOf(appState);
                if (idx > 0) setAppState(seq[idx - 1]);
              }}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--secondary, #a1a1aa)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary, #a1a1aa)'}
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        )}
        {appState === 'dashboard' && <Dashboard onStart={() => setAppState('setup')} />}
        {appState === 'setup' && <ProblemSetup onLaunch={(cfg) => { setConfig(cfg); setAppState('challenge'); }} />}
        {appState === 'challenge' && <Challenge config={config} onComplete={(t) => { setSolvedTopic(t); setAppState('learning'); }} />}
        {appState === 'learning' && <LearningOutcome topic={solvedTopic} language={config.language} onNext={() => setAppState('verification')} />}
        {appState === 'verification' && <Verification config={{...config, topic: solvedTopic}} onComplete={() => setAppState('dashboard')} />}
      </main>
    </>
  );
}

export default App;
