const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const predictionService = {
  async predictJobRole() {
    const response = await fetch(`${API_BASE_URL}/api/prediction/predict-job`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to predict job role');
    }
    
    return response.json();
  },

  async getJobInsights() {
    const response = await fetch(`${API_BASE_URL}/api/prediction/insights`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch job insights');
    }
    
    return response.json();
  },

  async getPredictionHistory() {
    const response = await fetch(`${API_BASE_URL}/api/prediction/history`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch prediction history');
    }
    
    return response.json();
  }
};