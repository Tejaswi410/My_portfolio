import React, { useState, useEffect, useRef } from 'react';

interface CommandHistory {
  command: string;
  output: string;
  id: number;
}

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [commandCounter, setCommandCounter] = useState(0);

  const welcomeMessage = `gatere@portfolio:~$ welcome
Hi, I'm Mark Gatere, a Software & AI Engineer.

Welcome to my interactive 'AI powered' portfolio terminal!
Type 'help' to see available commands.`;

const commands = {
    help: `Available commands:
help, about, projects, skills, experience, education, contact, certifications, clear, sudo`,
    
    about: `I'm Mark Gatere, a Software & AI Engineer passionate about solving problems with code.
I build tools with JavaScript, Python, and Machine Learning.`,
    
    projects: `1. BlogBox – A fullstack MERN blog platform. [GitHub: https://github.com/gateremark/blogbox]
2. GatereBot – Personal AI chatbot. [GitHub: https://github.com/gateremark/gaterebot]
3. MapsClone – Google Maps clone using React & Mapbox. [Live Demo: https://mapsclone.demo.com]`,
    
    skills: `JavaScript, React, Node.js, Python, MongoDB, TensorFlow, OpenAI API`,
    
    experience: `Software Engineer – XYZ Corp (2022–2024)
AI Developer – Freelance (2021–2022)`,
    
    education: `B.Sc. in Computer Science – Nairobi University (2016–2020)`,
    
    contact: `Email: mark.gatere@example.com
GitHub: https://github.com/gateremark
LinkedIn: https://linkedin.com/in/gateremark`,
    
    certifications: `AWS Certified Developer Associate (2023)
Google Cloud Professional Developer (2022)
Microsoft Azure Fundamentals (2021)`,
    
    welcome: `Hi, I'm Mark Gatere, a Software & AI Engineer.

Welcome to my interactive 'AI powered' portfolio terminal!
Type 'help' to see available commands.`,
    
    clear: 'CLEAR_COMMAND',
    
    sudo: `sudo: permission denied – You're not root!`
  };

  useEffect(() => {
    // Focus input on mount and keep it focused
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const typeText = async (text: string, commandId: number): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      let i = 0;
      const timer = setInterval(() => {
        if (i <= text.length) {
          setHistory(prev => 
            prev.map(item => 
              item.id === commandId 
                ? { ...item, output: text.slice(0, i) }
                : item
            )
          );
          i++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          resolve();
        }
      }, 20); // Typing speed
    });
  };

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newCommandId = commandCounter + 1;
    setCommandCounter(newCommandId);

    // Add command to command history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    const output = commands[trimmedCmd as keyof typeof commands] || `Command not found: ${cmd}. Type 'help' for available commands.`;
    
    // Add command and empty output first
    const newEntry: CommandHistory = {
      command: cmd,
      output: '',
      id: newCommandId
    };
    
    setHistory(prev => [...prev, newEntry]);
    
    // Type the output
    await typeText(output, newCommandId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      handleCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div 
      className="flex flex-col h-full cursor-text" 
      onClick={handleContainerClick}
    >
      <div ref={terminalRef} className="flex-1 overflow-y-auto pb-4 px-6 pt-4">
        {/* Welcome Message */}
        <div className="terminal-output mb-4">
          {welcomeMessage}
        </div>

        {/* Command History */}
        {history.map((item) => (
          <div key={item.id} className="mb-2">
            <div className="terminal-prompt">
              <span className="text-terminal-green">gateremark@portfolio:~$</span> {item.command}
            </div>
            {item.output && (
              <div className="terminal-output whitespace-pre-line">
                {item.output}
              </div>
            )}
          </div>
        ))}

        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="terminal-prompt mr-2">gateremark@portfolio:~$</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-terminal-green font-mono flex-1 w-full"
              disabled={isTyping}
              autoComplete="off"
              spellCheck={false}
            />
          </form>
          <span className="terminal-cursor ml-1">█</span>
        </div>
      </div>
      
      {/* Footer with timestamp */}
      <div className="border-t border-gray-700 px-6 py-3 flex justify-between items-center text-xs">
        <div className="text-terminal-green">
          [Interactive 3D Card]
        </div>
        <div className="text-gray-400">
          {getCurrentTimestamp()}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
