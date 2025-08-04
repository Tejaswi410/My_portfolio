import React from 'react';

const ProfileSidebar: React.FC = () => {
  return (
    <div className="bg-gray-900 h-screen w-80 flex flex-col items-center justify-center p-8 border-r border-gray-700">
      {/* Profile Image */}
      <div className="mb-8">
        <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-600">
          <img 
            src="/lovable-uploads/b434a1cd-bfe9-4114-8b11-ab75edfedc62.png" 
            alt="Mark Gatere"
            className="w-full h-full object-cover grayscale"
          />
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="text-center">
        <h1 className="text-terminal-green text-2xl font-bold mb-2">Mark Gatere</h1>
        <p className="text-gray-400 text-sm">Software Engineer</p>
      </div>
      
      {/* Interactive Elements */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="text-gray-500 text-xs">
          gateremark
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;