import React, { useState, useEffect } from 'react';
import { SimpleUserProfileForm } from '../Components/SimpleUserProfileForm';

interface UserProfile {
  name: string;
  degree: string;
  yearOfPassing: number;
  skills: string[];
  CGPA: string;
  Certifications: any[];
}

export const UpdateProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData: UserProfile) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/users/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        // Force re-render by updating the key
        setFetchLoading(true);
        setTimeout(() => setFetchLoading(false), 100);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <SimpleUserProfileForm
          key={userProfile ? JSON.stringify(userProfile) : 'empty'}
          initialData={userProfile || undefined}
          onSubmit={handleUpdateProfile}
          loading={loading}
        />
      </div>
    </div>
  );
};