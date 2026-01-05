import React from 'react';
import { UserProfile } from '../Components/UserProfile';

export const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <UserProfile />
      </div>
    </div>
  );
};