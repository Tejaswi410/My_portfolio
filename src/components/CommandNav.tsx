import React from 'react';

const CommandNav: React.FC = () => {
  const commands = [
    'help', 'about', 'projects', 'skills', 'experience', 
    'contact', 'education', 'certifications', 'leadership', 
    'sudo', 'clear'
  ];

  return (
    <div className="bg-terminal-bg border-b border-gray-700 px-6 py-3">
      <div className="text-terminal-green text-sm font-mono">
        {commands.map((cmd, index) => (
          <span key={cmd}>
            {cmd}
            {index < commands.length - 1 && (
              <span className="text-gray-500 mx-2">|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommandNav;