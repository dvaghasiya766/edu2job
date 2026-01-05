const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  name: string;
  degree: string;
  yearOfPassing: number;
  skills: string[];
  CGPA: string;
  Certifications: any[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const userService = {
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  },

  async updateUserProfile(profileData: UserProfile) {
    const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }
    
    return response.json();
  }
};