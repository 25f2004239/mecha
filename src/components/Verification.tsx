import { useState } from 'react';
import EditorModule from 'react-simple-code-editor';
const Editor = (EditorModule as any).default || EditorModule;
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { Play, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { addSolvedProblem } from '../utils/stats';
import { getVerificationCode, verifyFix } from '../utils/challenges';

export default function Verification({ config, onComplete }: { config: any, onComplete: () => void }) {
  const [code, setCode] = useState(() => {
    let topicToUse = config.topic;
    if (config.mode === 'random') {
       const topics = ['list_iteration', 'mutable_defaults', 'variable_shadowing', 'equality_identity', 'scope'];
       topicToUse = topics[Math.floor(Math.random() * topics.length)];
    }
    return getVerificationCode(topicToUse, config.language).code;
  });

  
  const [output, setOutput] = useState<{ type: 'error' | 'success' | null; text: string }>({ type: null, text: '' });
  const [isFixed, setIsFixed] = useState(false);
  const [hasStruggled, setHasStruggled] = useState(false);

  const runCode = () => {
    let topicToUse = config.topic;
    if (config.mode === 'random') {
       // Just pick a fallback or extract from title if needed, but since it's random we might have issues tracking which topic was randomly chosen unless we save it in state. Let's assume list_iteration for random verification fallback for now if we didn't save it. 
       topicToUse = 'list_iteration'; 
    }
    
    const { isCorrect, successMsg, errorMsg } = verifyFix(topicToUse, config.language, code);
    
    if (isCorrect) {
      setOutput({ type: 'success', text: successMsg });
      setIsFixed(true);
      addSolvedProblem('Verification Passed', topicToUse, hasStruggled);
    } else {
      setOutput({ type: 'error', text: errorMsg });
      setHasStruggled(true);
    }
  };

  return (
    <div className="flex-col gap-6 h-full animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-3 m-0">
          <ShieldCheck size={32} className="text-gradient" /> 
          Verification Challenge
        </h2>
        <p className="text-secondary mt-2 mb-0">Let's make sure you understood the concept. Fix the bug below without the tutor's help!</p>
      </div>

      <div className="glass-panel flex-col gap-4 p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-lg m-0">Task: Fix this new variation</h3>
          <button className="btn btn-primary" onClick={runCode}>
            <Play size={16} /> Check Answer
          </button>
        </div>
        
        <div className="code-editor-container" style={{ minHeight: '250px' }}>
          <Editor
            value={code}
            onValueChange={(code: string) => setCode(code)}
            highlight={(code: string) => {
              const lang = config.language === 'cpp' ? 'cpp' : (Prism.languages[config.language] ? config.language : 'javascript');
              return Prism.highlight(code, Prism.languages[lang] || Prism.languages.javascript, lang);
            }}
            padding={15}
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 16,
              outline: 'none',
              border: 'none',
              minHeight: '200px'
            }}
          />
        </div>
        
        <div className="flex-col gap-2 mt-2">
          <h3 className="text-secondary text-sm m-0">Console Output</h3>
          <div className={"output-terminal " + (output.type === 'error' ? 'error' : '')}>
            {output.text || 'Run your code to see if it works...'}
          </div>
        </div>

        {isFixed && (
          <div className="mt-6 flex flex-col items-center gap-4 animate-fade-in p-6 rounded-xl" style={{ backgroundColor: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.3)' }}>
            <div className="flex items-center gap-2 text-success text-xl font-bold">
              <CheckCircle size={28} /> Concept Mastered!
            </div>
            <p className="text-center text-sm text-secondary m-0">You successfully applied your knowledge of list iteration.</p>
            <button className="btn btn-primary" onClick={onComplete}>
              Return to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
