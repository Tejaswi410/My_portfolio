import React from 'react';
import ProfileSidebar from './ProfileSidebar';
import CommandNav from './CommandNav';
import Terminal from './Terminal';

const PortfolioLayout: React.FC = () => {
  return (
    <div className="h-screen flex bg-terminal-bg">
      {/* Left Sidebar */}
      <ProfileSidebar />
      
      {/* Right Terminal Area */}
      <div className="flex-1 flex flex-col">
        {/* Command Navigation */}
        <CommandNav />
        
        {/* Terminal */}
        <div className="flex-1">
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default PortfolioLayout;