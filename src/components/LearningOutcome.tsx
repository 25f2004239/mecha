
import { Lightbulb, AlertTriangle, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { getLearningOutcome } from '../utils/challenges';

export default function LearningOutcome({ topic, language, onNext }: { topic: string, language: string, onNext: () => void }) {
  const outcome = getLearningOutcome(topic, language);

  return (
    <div className="flex-col gap-6 animate-fade-in max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'rgba(0, 230, 118, 0.1)', border: '2px solid var(--success)' }}>
          <CheckCircle size={32} color="var(--success)" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Awesome! You fixed it.</h1>
        <p className="text-secondary text-lg">Let's review what happened and what you learned.</p>
      </div>

      <div className="glass-panel p-6 flex-col gap-6">
        <div className="flex gap-4 items-start">
          <div className="p-3 rounded-lg bg-red-900/20 text-red-400" style={{ backgroundColor: 'rgba(255, 75, 75, 0.1)' }}>
            <AlertTriangle size={24} color="var(--error)" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">What was wrong</h3>
            <p className="text-secondary">
              The original code had the following issues:
              <ul className="list-disc ml-6 mt-2">
                {outcome.wrong.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(199, 125, 255, 0.1)' }}>
            <Lightbulb size={24} color="var(--accent-purple)" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">What concept you learned</h3>
            <p className="text-secondary">
              <strong className="text-primary">{outcome.concept.split('.')[0]}.</strong> 
              {outcome.concept.substring(outcome.concept.indexOf('.') + 1)}
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(102, 252, 241, 0.1)' }}>
            <ShieldAlert size={24} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">How to avoid this mistake next time</h3>
            <p className="text-secondary">
              {outcome.avoid}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button className="btn btn-primary pulse-glow" onClick={onNext} style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
          Take Verification Challenge <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
