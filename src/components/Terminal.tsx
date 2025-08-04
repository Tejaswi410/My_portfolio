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
  const [currentTime, setCurrentTime] = useState(new Date());

  const welcomeMessage = `tejaswi@portfolio:~$ welcome
Hi, I'm Tejaswi Yadav, B.Tech student in Artificial Intelligence & Data Science.

Welcome to my interactive 'AI powered' portfolio terminal!
Type 'help' to see available commands.`;

  const commands = {
    help: `Available commands:
help, about, projects, skills, experience, education, contact, certifications, clear, sudo`,
    
    about: `I'm Tejaswi Yadav, B.Tech student in Artificial Intelligence & Data Science with a strong foundation in Python, machine learning, and web development. I'm passionate about building real-world projects that combine AI and intuitive design.`,
    
    projects: `1. Thoughtify – An anonymous thought-sharing web app
   Stack: Django, Tailwind CSS, HTMX
   Features: User code anonymity, emotion tagging, daily prompts
   GitHub: https://github.com/Tejaswi410/Thoughtify

2. Stockzy – Stock price analysis & forecasting tool
   Stack: Streamlit, yfinance, Meta's Prophet, Pandas
   Features: Real-time data, future predictions, interactive visualizations
   GitHub: https://github.com/Tejaswi410/Stockzy`,
    
    skills: `Languages: Python, Java, C, SQL
Frameworks/Tech: Django, Tailwind CSS, HTML5, CSS3
Tools: Git, GitHub, VS Code, PyCharm, IntelliJ`,
    
    experience: `Instructor – irobokid (June 2024 – Jan 2025), Mumbai
- Taught Python, Arduino, and web dev to students in an interactive setting.
- Provided hands-on mentorship and real-world coding problem-solving.

Student Intern – AICTE Eduskills AIML Virtual Internship (Mar 2023 – Jun 2023)
- Built and tuned ML models using Scikit-learn, TensorFlow, Keras.
- Conducted data analysis and visualization using Pandas, Matplotlib, Seaborn.`,
    
    education: `Shah & Anchor Kutchhi Engineering College, Mumbai (2022–2026)
B.Tech in Artificial Intelligence & Data Science — CGPA: 8.87`,
    
    contact: `Email: tejaswi14.work@gmail.com
Phone: +91-8356087790
LinkedIn: https://www.linkedin.com/in/tejaswiyadav14
GitHub: https://github.com/Tejaswi410
Portfolio: https://codolio.com/profile/tejaswi_coder01`,
    
    certifications: `- Streamlit Bootcamp – Udemy
  Certificate: https://www.udemy.com/certificate/UC-9bac55ce-706b-4422-85f7-84071848fbe8/

- Data Structures and Algorithms – Infosys Springboard
  Certificate: https://drive.google.com/file/d/1lUW1fuG7amrNqAUqU6SGBNchrcoTBjLl/view?usp=drive_link

- Python – Spoken Tutorial (IIT Bombay)
  Certificate: https://drive.google.com/file/d/1PXIdRxGhK7kWoMYDyYDe1T-5oc4NZbhA/view?usp=sharing`,
    
    welcome: `Hi, I'm Tejaswi Yadav, B.Tech student in Artificial Intelligence & Data Science.

Welcome to my interactive 'AI powered' portfolio terminal!
Type 'help' to see available commands.`,
    
    clear: 'CLEAR_COMMAND',
    
    sudo: `sudo: permission denied – you're not admin here 😄`
  };


// Focus input and scroll on history/input change
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  if (inputRef.current) {
    inputRef.current.focus();
  }
}, [history, input]);

// Update time every second
useEffect(() => {
  const timeInterval = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(timeInterval);
}, []);
  useEffect(() => {
    // Auto-scroll to bottom when history or input changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    // Auto-focus input after each command
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history, input]);


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
  const day = currentTime.getDate().toString().padStart(2, '0');
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const year = currentTime.getFullYear();
  const time = currentTime.toLocaleTimeString();
  return `${day}/${month}/${year} ${time}`;
};
  const bottomRef = useRef<HTMLDivElement>(null);

return (
    <div 
      className="flex flex-col h-full w-full cursor-text" 
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
              <span className="text-terminal-green">tejaswi@portfolio:~$</span> {item.command}
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
          <span className="terminal-prompt mr-2">tejaswi@portfolio:~$</span>
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
        <div ref={bottomRef} />
      </div>
      
      {/* Footer with timestamp */}
      <div className="border-t border-gray-700 px-6 py-3 flex justify-end items-center text-xs">
        <div className="text-gray-400">
          {getCurrentTimestamp()}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
