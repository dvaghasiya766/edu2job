// Test script to verify prediction endpoint
import fetch from 'node-fetch';

const testPrediction = async () => {
  try {
    // First test server connectivity
    const testResponse = await fetch('http://localhost:8000/test');
    const testData = await testResponse.json();
    console.log('Server test:', testData);

    // Test prediction endpoint (this will fail without auth token, but should show the endpoint exists)
    const predResponse = await fetch('http://localhost:8000/api/prediction/predict-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const predData = await predResponse.json();
    console.log('Prediction endpoint response:', predData);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testPrediction();