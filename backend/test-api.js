// Simple API test script
// Run with: node test-api.js

const testUpdateProfile = async () => {
  const testData = {
    name: "John Doe",
    degree: "B.Tech",
    yearOfPassing: 2024,
    skills: ["JavaScript", "React", "Node.js"],
    CGPA: "8.5",
    certifications: [
      {
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        year: 2023
      }
    ]
  };

  console.log('Test data for profile update:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\nEndpoint: PUT /api/user/update-profile');
  console.log('Headers: Authorization: Bearer <token>');
  console.log('Content-Type: application/json');
};

testUpdateProfile();