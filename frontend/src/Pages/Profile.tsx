import React from 'react';
import { useAuth } from '../Hooks/Context/AuthContext';
import AdminProfile from '../Components/AdminProfile';
import StudentProfile from './StudentProfile';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminProfile />;
  }

  return <StudentProfile />;
};

export default Profile;
