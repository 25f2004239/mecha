import { useState, useEffect } from 'react';
import EditorModule from 'react-simple-code-editor';
const Editor = (EditorModule as any).default || EditorModule;
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { Play, Bot, Send, ArrowRight } from 'lucide-react';
import { getChallengeCode, verifyFix } from '../utils/challenges';
import { addSolvedProblem } from '../utils/stats';

interface Message {
  role: 'tutor' | 'user';
  content: string;
}

export default function Challenge({ config, onComplete }: { config: any, onComplete: (topic: string) => void }) {
  const getInitialState = () => {
    if (config.mode === 'custom') {
      let codeComment = '# Paste your broken code here\n\n';
      if (['java', 'cpp', 'javascript', 'rust'].includes(config.language)) {
          codeComment = '// Paste your broken code here\n\n';
      }
      return {
        title: 'Custom User Bug',
        code: codeComment,
        messages: [{ role: 'tutor', content: `I see you brought your own ${config.language} code! Since I am running offline, I can only give you general advice. What are you trying to build?` }] as Message[]
      };
    }
    
    let topicToUse = config.topic;
    if (config.mode === 'random') {
       const topics = ['list_iteration', 'mutable_defaults', 'variable_shadowing', 'equality_identity', 'scope'];
       topicToUse = topics[Math.floor(Math.random() * topics.length)];
    }

    const chal = getChallengeCode(topicToUse, config.language);
    return {
      title: chal.title,
      code: chal.code,
      messages: [{ role: 'tutor', content: `Welcome to this challenge! Let's debug this ${config.language} code.` }] as Message[]
    };
  };

  const initialState = getInitialState();
  
  const [code, setCode] = useState(initialState.code);
  const [output, setOutput] = useState<{ type: 'error' | 'success' | null; text: string }>({ type: null, text: '' });
  const [messages, setMessages] = useState<Message[]>(initialState.messages);
  const [chatInput, setChatInput] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [hasStruggled, setHasStruggled] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);

  useEffect(() => {
    async function initPyodide() {
      if ((window as any).loadPyodide) {
        const py = await (window as any).loadPyodide();
        setPyodide(py);
      }
    }
    initPyodide();
  }, []);

  const runCode = () => {
    if (config.mode === 'custom') {
       if (config.language !== 'python') {
         setOutput({ type: 'error', text: `Execution for ${config.language} is not supported in the browser yet. Please select Python for Custom mode!` });
         setMessages(prev => [...prev, { role: 'tutor', content: `Currently, bringing your own code to run in the browser is only supported for Python. For ${config.language}, you can use the curated challenges!` }]);
         return;
       }

       if (!pyodide) {
         setOutput({ type: 'error', text: 'Initializing Python engine in your browser, please wait a moment and try again...' });
         return;
       }
       
       setOutput({ type: null, text: 'Running code securely in your browser...' });
       
       try {
         // Redirect stdout and stderr to capture prints
         pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
         `);
         
         pyodide.runPython(code);
         
         const stdout = pyodide.runPython('sys.stdout.getvalue()');
         const stderr = pyodide.runPython('sys.stderr.getvalue()');
         
         if (stderr) {
            setOutput({ type: 'error', text: stderr });
            setMessages(prev => [...prev, { role: 'tutor', content: 'Ah, looks like your code threw an error! What do you think went wrong based on the output?' }]);
         } else {
            setOutput({ type: 'success', text: stdout || 'Code executed successfully (no output).' });
            setMessages(prev => [...prev, { role: 'tutor', content: 'Your custom code ran successfully! Anything else you want to try?' }]);
         }
       } catch (err: any) {
         setOutput({ type: 'error', text: err.message });
         setMessages(prev => [...prev, { role: 'tutor', content: 'Ah, looks like your code threw an error! What do you think went wrong based on the output?' }]);
       }
       
       return;
    }
    

    // Curated Mode Evaluation (Any Language)
    let topicToUse = config.topic;
    if (config.mode === 'random') {
       const topics = ['list_iteration', 'mutable_defaults', 'variable_shadowing', 'equality_identity', 'scope'];
       topicToUse = topics.find(t => initialState.title.toLowerCase().includes(t.split('_')[0])) || 'list_iteration';
    }

    const { isCorrect, successMsg, errorMsg } = verifyFix(topicToUse, config.language, code);
    
    if (isCorrect) {
      setOutput({ type: 'success', text: successMsg });
      setIsFixed(true);
      addSolvedProblem(initialState.title, topicToUse, hasStruggled || hintLevel > 0);
      setMessages(prev => [...prev, { role: 'tutor', content: `Great job! You fixed the ${config.language} code. Let's review what you learned.` }]);
    } else {
      setOutput({ type: 'error', text: errorMsg });
      setHasStruggled(true);
      giveHint(`The output isn't quite right. Keep trying!`);
    }
  };

  const giveHint = (contextualHint?: string) => {
    if (contextualHint) {
      setMessages(prev => [...prev, { role: 'tutor', content: contextualHint }]);
    } else {
      setMessages(prev => [...prev, { role: 'tutor', content: "I noticed you're stuck. Feel free to ask me any questions about the code or the error!" }]);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userText = chatInput.trim();
    const userMsg: Message = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    setTimeout(() => {
      const input = userText.toLowerCase();
      let reply = "";

      const generateHint = () => {
        let hintReply = "";
        if (initialState.title.includes('Iteration')) {
           if (hintLevel === 0) { hintReply = "Look closely at the code. Something is off with the numbering or structure."; setHintLevel(1); }
           else if (hintLevel === 1) { hintReply = config.language === 'html' ? "Make sure all tags are properly closed." : (config.language === 'css' ? "Remember that CSS pseudo-classes are often 1-indexed, not 0-indexed." : "Arrays and Lists in programming are zero-indexed! The first item is at index 0."); setHintLevel(2); }
           else { 
             if (config.language === 'python') hintReply = "Iterate directly using `for item in numbers:` or fix the range.";
             else if (config.language === 'html') hintReply = "Close the second `<li>` tag properly!";
             else if (config.language === 'css') hintReply = "Change `nth-child(0)` to `nth-child(1)`.";
             else hintReply = "Make sure your loop starts at 0 and ends right before the length of the array (`i < array.length` or `i < 3`)!"; 
           }
        }
        else if (initialState.title.includes('Static') || initialState.title.includes('Borrow') || initialState.title.includes('Default') || initialState.title.includes('Shared') || initialState.title.includes('Global Styles')) {
           if (hintLevel === 0) { hintReply = "Notice how the state is being shared where it shouldn't be."; setHintLevel(1); }
           else if (hintLevel === 1) { hintReply = config.language === 'html' ? "IDs must be unique in an HTML document." : (config.language === 'css' ? "Styling general tags can accidentally style everything." : "The state is being shared! Whether it's a static variable or a mutable default, the data persists."); setHintLevel(2); }
           else { 
             if (config.language === 'java' || config.language === 'c') hintReply = "Remove the `static` keyword so each instance/call gets its own data!";
             else if (config.language === 'rust') hintReply = "Pass by reference `&mut Vec` or clone the data so it doesn't get moved!";
             else if (config.language === 'html') hintReply = "Change the duplicate ID to something unique.";
             else if (config.language === 'css') hintReply = "Use a class (like `.btn`) instead of the `button` tag selector.";
             else hintReply = "Use `my_list=None` and initialize the list inside the function!"; 
           }
        }
        else if (initialState.title.includes('Shadowing') || initialState.title.includes('Inline') || initialState.title.includes('Specificity')) {
           if (hintLevel === 0) { hintReply = "Your changes are being overridden or ignored because of how priority works here."; setHintLevel(1); }
           else if (hintLevel === 1) { hintReply = (config.language === 'html' || config.language === 'css') ? "Specificity determines which styles are applied. `!important` or specific tags break the flow." : "To modify a variable from the outer scope, you need to explicitly declare your intent or use the `this` keyword."; setHintLevel(2); }
           else { 
             if (config.language === 'java') hintReply = "Use `this.score = val * 2;` or don't re-declare `int score`!";
             else if (config.language === 'rust') hintReply = "Avoid `let` if you want to mutate the outer variable, and make it `mut`!";
             else if (config.language === 'c') hintReply = "Just do `x = 20;` without re-declaring it with `int`!";
             else if (config.language === 'html') hintReply = "Remove the `!important` rule from the CSS.";
             else if (config.language === 'css') hintReply = "Make sure your selector is specific enough, or ensure you're overriding correctly.";
             else hintReply = "Use `global x` at the start of the function!"; 
           }
        }
        else if (initialState.title.includes('Equality') || initialState.title.includes('Semantic') || initialState.title.includes('Pointer')) {
           if (hintLevel === 0) { hintReply = "Are you checking if the values are equal, or if they are the exact same entity?"; setHintLevel(1); }
           else if (hintLevel === 1) { hintReply = (config.language === 'html') ? "Some tags look visually identical but mean different things semantically." : "Because the objects were created separately, they might live in different memory locations."; setHintLevel(2); }
           else { 
             if (config.language === 'java') hintReply = "Use `.equals()` instead of `==` to compare String values!";
             else if (config.language === 'c') hintReply = "Use `strcmp(a, b) == 0` to compare string contents in C!";
             else if (config.language === 'html') hintReply = "Replace `<b>` with `<strong>` for semantic meaning.";
             else if (config.language === 'css') hintReply = "IDs (`#header`) override classes (`.header`) due to higher specificity.";
             else if (config.language === 'rust') hintReply = "Actually `==` works for values in Rust, but make sure you compare the same types!";
             else hintReply = "Change `is` to `==` for a value equality check!"; 
           }
        }
        else if (initialState.title.includes('Scope') || initialState.title.includes('Immutability') || initialState.title.includes('Lambda') || initialState.title.includes('Dangling') || initialState.title.includes('Form')) {
           if (hintLevel === 0) { hintReply = "You are trying to access or link something that isn't valid in this context."; setHintLevel(1); }
           else if (hintLevel === 1) { hintReply = (config.language === 'html') ? "Form labels need to explicitly point to the ID of the input they control." : "How do we tell the code to properly use and retain the variable?"; setHintLevel(2); }
           else { 
             if (config.language === 'java') hintReply = "Use an `AtomicInteger` or a 1-element array since lambdas require effectively final variables!";
             else if (config.language === 'c') hintReply = "Return memory allocated with `malloc`, or use a `static` variable so it survives the function exit!";
             else if (config.language === 'html') hintReply = "Set the `for` attribute on the label to `email_input`.";
             else if (config.language === 'rust') hintReply = "Use the `mut` keyword when declaring the variable!";
             else hintReply = "Declare the variable properly using the `global` keyword!"; 
           }
        }
        else if (initialState.title === 'Custom User Bug') {
           if (output.type === 'error') {
              hintReply = "I see your code threw an error! Instead of just telling you the answer, let's figure it out together. What do you think the error message is trying to tell us?";
           } else if (code.includes('def ') || code.includes('fn ') || code.includes('void ')) {
              hintReply = "I notice you're writing a function! Functions are great for reusable logic. Are you stuck on what parameters it needs, what it should return, or local variable scope?";
           } else if (code.includes('for ') || code.includes('while ')) {
              hintReply = "It looks like you're writing a loop. Loops can be tricky! Are you struggling with the boundaries (like an off-by-one error) or the logic inside?";
           } else if (code.includes('if ') || code.includes('elif ')) {
              hintReply = "I see some conditional statements. Are you having trouble figuring out the right boolean logic to check?";
           } else {
              hintReply = "I see your code! What exactly are you trying to build, and where are you getting stuck? Let's walk through it step-by-step.";
           }
        }
        return hintReply;
      };

      // 1. Generic Conversational
      if (input.match(/^(hi|hello|hey|greetings|sup)/)) reply = "Hey there! Spark here. 👋 Ready to dive into some code?";
      else if (input.match(/(how are you|how do you do)/)) reply = "I'm just a bunch of local code, but I'm feeling great! How are you doing with this challenge?";
      else if (input.match(/(who are you|what are you)/)) reply = "I'm Spark, your fully local, offline AI programming mentor! 🤖";
      else if (input.match(/(thanks|thank you|ty)/)) reply = "You're very welcome! Let me know if you need anything else.";
      else if (input.match(/(ok|okay|got it|makes sense)/)) reply = "Awesome! Give it a try and run the code.";
      else if (input.match(/(fuck|shit|damn|crap|sucks)/)) reply = "I know debugging can be incredibly frustrating. Take a deep breath, we can figure this out together!";
      
      // 2. General Questions
      else if (input.match(/(what is a list|how do lists work|array)/)) reply = "A list (or array) is like a container that holds items in order. You access them starting at index 0!";
      else if (input.match(/(what is a loop|for loop|while loop)/)) reply = "Loops let you repeat actions! A `for` loop goes through items one by one, which is perfect for lists/arrays.";
      else if (input.match(/(what is a function|def |fn )/)) reply = "Functions are reusable blocks of code. You define them and call them to perform actions.";
      else if (input.match(/(what is range|how does range work)/)) reply = "It creates a sequence of numbers from a start value up to (but not including) a stop value!";
      else if (input.match(/(print)/)) reply = "The print command outputs text or variables to the console.";
      else if (input.includes('python') || input.includes('java') || input.includes('rust')) reply = "That's a fantastic language! It's what we're working with right now. What specifically about it are you wondering about?";

      // 3. Contextual: Errors
      else if (input.match(/(what|which).*(error|wrong)/)) {
        if (output.type === 'error' && output.text) {
           reply = "The console output says: \n`" + output.text.trim().split('\n').pop() + "`\nDoes that help point you in the right direction?";
        } else {
           reply = "I don't see any recent errors! Try running the code first.";
        }
      }
      else if ((input.includes('error') || input.includes('wrong') || input.includes('broken') || input.includes('fix') || input.includes('rectify') || input.includes('solve')) && output.type === 'error') {
         const lastLine = output.text.trim().split('\n').pop() || '';
         if (lastLine.includes('SyntaxError') || lastLine.includes('expected')) reply = "I see a Syntax/Compilation error in your output! This usually means there's a typo, missing parentheses, missing semicolon, or a missing colon `:` somewhere. Double check your recent changes!";
         else if (lastLine.includes('IndentationError')) reply = config.language === 'python' ? "Python is very strict about spaces! Make sure your code inside loops or functions is indented with exactly 4 spaces or 1 tab." : "Check your indentation and bracket placement!";
         else if (lastLine.includes('TypeError') || lastLine.includes('mismatched')) reply = "A TypeError/Type Mismatch means you're trying to do something to a data type that doesn't support it, like adding a string and an integer.";
         else if (lastLine.includes('NameError') || lastLine.includes('cannot find')) reply = "A NameError means you are trying to use a variable or function that hasn't been defined yet! Did you misspell it?";
         else reply = "Your code threw an error! Here is the last part of it: `" + lastLine + "`. Usually, the line number and the type of error tell you exactly what to fix!";
      }

      // 4. Progressive Hints (Greatly expanded keywords)
      else if (input.match(/(hint|clue|help|stuck|don't know|dont know|solution|confused|lost|no idea|what to do|guide|assist|explain|teach)/)) {
        reply = generateHint();
      }

      // 5. Contextual: List Iteration
      else if (initialState.title.includes('Iteration') && input.match(/(index|0|zero)/)) reply = "Exactly! Arrays are zero-indexed, meaning the first element is at index 0. How can we change the loop to start there?";
      else if (initialState.title.includes('Iteration') && input.match(/(why is it skipping|why 1|where is 1)/)) reply = "By starting at 1, you are skipping the item at index 0 (which is the number 1).";

      // 6. Contextual: Mutable Defaults
      else if (initialState.title.includes('Default') && input.match(/(none|null|static)/)) {
          if (config.language === 'python') reply = "Yes, `None` is the way to go! Like this: `def add_item(item, my_list=None):`... what comes next inside the function?";
          else if (config.language === 'java') reply = "Yes, try removing `static` so it's not shared!";
          else reply = "Yes! You need to make sure the state is not shared across calls.";
      }

      // 7. Contextual: Variable Shadowing
      else if ((initialState.title.includes('Shadowing') || initialState.title.includes('Inline')) && (input.includes('shadow') || input.includes('outer') || input.includes('inner') || input.includes('override'))) reply = "When you re-declare something or use a higher specificity rule, it 'shadows' or overrides the original one!";
      else if ((initialState.title.includes('Shadowing') || initialState.title.includes('Inline')) && (input.includes('fix') || input.includes('global') || input.includes('how'))) {
          if (config.language === 'python') reply = "You can fix this by explicitly referencing the outer scope with `global`. Give it a try!";
          else if (config.language === 'java') reply = "You can fix this by using `this.` to explicitly reference the class field!";
          else if (config.language === 'c') reply = "Just assign the variable without re-declaring it with `int`!";
          else if (config.language === 'html') reply = "Remove the !important tag to let styles cascade properly!";
          else if (config.language === 'css') reply = "Ensure your selector is specific enough to override the default!";
          else reply = "You can fix this by modifying the outer variable directly instead of declaring a new one.";
      }
      else if (initialState.title.includes('Shadowing') || initialState.title.includes('Inline')) reply = "Why do you think the value didn't change? Think about scope and specificity!";
      
      // 8. Contextual: Equality vs Identity
      else if ((initialState.title.includes('Equality') || initialState.title.includes('Pointer') || initialState.title.includes('Semantic')) && (input.includes('==') || input.includes('value'))) reply = "Yes! You need to check if the *values* or meanings are equal, not the memory locations or raw text.";
      else if ((initialState.title.includes('Equality') || initialState.title.includes('Pointer') || initialState.title.includes('Semantic')) && (input.includes('fix') || input.includes('how'))) {
          if (config.language === 'java') reply = "Try replacing the identity check with `.equals()`.";
          else if (config.language === 'c') reply = "Try using `strcmp()` to compare the string contents.";
          else if (config.language === 'html') reply = "Replace <b> with the semantic <strong> tag.";
          else if (config.language === 'css') reply = "Use a class instead of an ID if you want to reuse it, or use the ID to override the class.";
          else reply = "Try replacing the identity check with a value equality operator.";
      }
      else if (initialState.title.includes('Equality') || initialState.title.includes('Pointer') || initialState.title.includes('Semantic')) reply = "Even though the items look identical, they might be stored differently in memory or mean different things! How do we check properly?";
      
      // 9. Contextual: Scope & Global Keyword
      else if ((initialState.title.includes('Scope') || initialState.title.includes('Dangling') || initialState.title.includes('Form')) && (input.includes('unboundlocalerror') || input.includes('local') || input.includes('dangling'))) reply = "Because you are assigning a value that is strictly local, it disappears when the scope ends!";
      else if ((initialState.title.includes('Scope') || initialState.title.includes('Dangling') || initialState.title.includes('Form')) && (input.includes('fix') || input.includes('global'))) {
          if (config.language === 'python') reply = "You need to explicitly tell the compiler with `global` that you want to modify the outer variable.";
          else if (config.language === 'java') reply = "You need to use a mutable container like an array or AtomicInteger.";
          else if (config.language === 'c') reply = "Allocate memory dynamically using `malloc` or declare the variable as `static`.";
          else if (config.language === 'html') reply = "Update the `for` attribute on the label to match the input's `id`.";
          else reply = "You need to make the variable explicitly mutable.";
      }
      else if (initialState.title.includes('Scope') || initialState.title.includes('Dangling') || initialState.title.includes('Form')) reply = "The system is confused because you are trying to access something outside its valid scope. What can we use to fix that?";
      
      // 10. Contextual: Custom User Bug
      else if (initialState.title === 'Custom User Bug' && (input.includes('why'))) reply = "Since you brought your own code, I can't read your mind, but I recommend checking your syntax, indentation, and the exact error output above!";
      else if (initialState.title === 'Custom User Bug' && (code.includes('def ') || code.includes('fn ')) && !code.includes('return')) reply = "I see a function definition in your code, but no `return` statement. Could that be the issue?";
      
      // 11. Catch-all fallbacks
      else if (input.includes('?')) reply = "That's a great question! Based on your code, try running it to see what the console tells us, or look closely at how the language handles the syntax here.";
      else reply = "It sounds like you might be stuck! Let me give you a hint: " + generateHint();
      
      setMessages(prev => [...prev, { role: 'tutor', content: reply }]);
    }, 400);
  };

  return (
    <div className="flex gap-6 h-full animate-fade-in" style={{ minHeight: '70vh' }}>
      <div className="glass-panel flex-col gap-4 p-6" style={{ flex: 3 }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="flex items-center gap-2 m-0">
            <span className="text-gradient">Challenge:</span> {initialState.title}
          </h2>
          <button className="btn btn-primary" onClick={runCode}>
            <Play size={16} /> Run Code
          </button>
        </div>
        
        <div className="code-editor-container" style={{ flex: 1, minHeight: '300px' }}>
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
              minHeight: '100%'
            }}
          />
        </div>
        
        <div className="flex-col gap-2 mt-4">
          <h3 className="text-secondary text-sm m-0">Console Output</h3>
          <div className={"output-terminal " + (output.type === 'error' ? 'error' : '')}>
            {output.text || 'Run your code to see output here...'}
          </div>
        </div>
      </div>

      <div className="glass-panel flex-col p-0" style={{ flex: 2, display: 'flex' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <h3 className="flex items-center gap-2 text-gradient m-0">
            <Bot size={20} /> AI Socratic Tutor
          </h3>
        </div>
        
        <div className="flex-col gap-4 p-4 overflow-y-auto" style={{ flex: 1 }}>
          {messages.map((m, i) => (
            <div key={i} className={"flex " + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div 
                className="p-3"
                style={{ 
                  backgroundColor: m.role === 'user' ? 'rgba(102, 252, 241, 0.1)' : 'rgba(199, 125, 255, 0.1)',
                  border: "1px solid " + (m.role === 'user' ? 'rgba(102, 252, 241, 0.3)' : 'rgba(199, 125, 255, 0.3)'),
                  borderRadius: '12px',
                  borderBottomRightRadius: m.role === 'user' ? '2px' : '12px',
                  borderBottomLeftRadius: m.role === 'tutor' ? '2px' : '12px',
                  maxWidth: '85%'
                }}
              >
                <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }} className="m-0">{m.content}</p>
              </div>
            </div>
          ))}
          {isFixed && (
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary pulse-glow" onClick={() => {
                let t = config.topic;
                if (config.mode === 'random') {
                  const topics = ['list_iteration', 'mutable_defaults', 'variable_shadowing', 'equality_identity', 'scope'];
                  t = topics.find(tt => initialState.title.toLowerCase().includes(tt.split('_')[0])) || 'list_iteration';
                }
                onComplete(t);
              }}>
                Continue to Lesson <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleChatSubmit} className="p-4 border-t flex gap-2 m-0" style={{ borderColor: 'var(--border-color)' }}>
          <input 
            type="text" 
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Type your answer or ask for a hint..." 
            className="glass-card"
            style={{ 
              flex: 1, 
              padding: '10px 15px', 
              color: 'white', 
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
          <button type="submit" className="btn btn-secondary" style={{ padding: '10px', borderRadius: '8px' }}>
            <Send size={18} color="var(--accent-cyan)" />
          </button>
        </form>
      </div>
    </div>
  );
}
