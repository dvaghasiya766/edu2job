// Test Python ML server integration
import axios from 'axios';

const testMLServer = async () => {
  const testData = {
    degree: "B.Tech",
    specialization: "CSE",
    cgpa: 8.5,
    year_of_passing: 2024,
    certifications: 2
  };

  try {
    console.log('Testing ML server connection...');
    console.log('Sending data:', testData);
    
    const response = await axios.post('http://127.0.0.1:5000/predict', testData, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('ML Server Response:', response.data);
    console.log('✅ ML server is working correctly!');
    
  } catch (error) {
    console.log('❌ ML server connection failed:');
    console.log('Error:', error.message);
    console.log('Make sure your Python ML server is running on http://127.0.0.1:5000');
  }
};

testMLServer();