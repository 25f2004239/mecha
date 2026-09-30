
import { Target, Flame, Brain, CheckCircle, Code, Shield } from 'lucide-react';
import { getStats } from '../utils/stats';

export default function Dashboard({ onStart }: { onStart: () => void }) {
  const data = getStats();
  
  const stats = [
    { label: 'Bugs Fixed', value: data.bugsFixed.toString(), icon: <Code size={24} color="var(--accent-cyan)" /> },
    { label: 'Concepts Learned', value: data.conceptsLearned.toString(), icon: <Brain size={24} color="var(--accent-purple)" /> },
    { label: 'Problems Solved', value: data.problemsSolved.toString(), icon: <CheckCircle size={24} color="var(--success)" /> },
    { label: 'Current Streak', value: data.streak + ' Days', icon: <Flame size={24} color="var(--warning)" /> },
  ];

  return (
    <div className="flex-col gap-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="text-gradient">Student</span></h1>
          <p className="text-secondary">Ready to find some bugs and learn today?</p>
        </div>
        <div className="flex flex-col gap-3">
          <button className="btn btn-primary pulse-glow" onClick={onStart} style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
            <Target size={20} /> Start Next Challenge
          </button>
          <button className="btn btn-secondary" onClick={onStart} style={{ padding: '15px 30px', fontSize: '1.1rem', borderColor: 'var(--accent-purple)' }}>
            <Code size={20} color="var(--accent-purple)" /> Custom Bug / Any Language
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card flex-col p-6 items-center justify-center gap-2" style={{ flex: 1 }}>
            {stat.icon}
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <span className="text-secondary text-sm">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-6 mt-4">
        <div className="glass-panel p-6 flex-col gap-4" style={{ flex: 1 }}>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gradient">
            <Shield size={22} /> Weak Concepts
          </h2>
          <p className="text-secondary text-sm mb-2">Concepts you need to practice more based on your recent mistakes.</p>
          
          <div className="flex-col gap-3">
            {data.weakConcepts.slice(0, 3).map((concept, i) => (
               <div key={i} className="flex justify-between items-center p-3 rounded glass-card" style={{ background: 'rgba(255, 75, 75, 0.05)', borderColor: 'rgba(255, 75, 75, 0.2)' }}>
                 <span>{concept}</span>
                 <span style={{ color: 'var(--error)' }}>Needs Work</span>
               </div>
            ))}
            {data.weakConcepts.length === 0 && (
               <div className="text-secondary text-sm text-center mt-4">You have no weak concepts right now! Great job.</div>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 flex-col gap-4" style={{ flex: 1 }}>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gradient">
            <CheckCircle size={22} /> Recently Fixed Mistakes
          </h2>
          
          <div className="flex-col gap-3">
            {data.recentMistakes.slice(0, 3).map((mistake, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded glass-card">
                <div className="flex-col">
                  <span className="font-medium">{mistake.title}</span>
                  <span className="text-xs text-secondary">{mistake.concept}</span>
                </div>
                <span className="text-xs text-secondary">{mistake.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
