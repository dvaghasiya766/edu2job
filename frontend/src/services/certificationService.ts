const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const certificationService = {
  async addCertification(certification: { title: string; issuer: string; year: number }) {
    const response = await fetch(`${API_BASE_URL}/users/certifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(certification)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add certification');
    }
    
    return response.json();
  },

  async updateCertification(id: string, certification: { title: string; issuer: string; year: number }) {
    const response = await fetch(`${API_BASE_URL}/users/certifications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(certification)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update certification');
    }
    
    return response.json();
  },

  async deleteCertification(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/certifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete certification');
    }
    
    return response.json();
  }
};