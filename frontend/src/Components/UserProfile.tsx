import React, { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  degree: string;
  yearOfPassing: number;
  skills: string[];
  CGPA: string;
  Certifications: any[];
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: '', email: '', degree: '', yearOfPassing: 2024, skills: [], CGPA: '', Certifications: []
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/users/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Degree:</strong> {user.degree}</div>
            <div><strong>Year:</strong> {user.yearOfPassing}</div>
            <div><strong>CGPA:</strong> {user.CGPA}</div>
          </div>
          <div>
            <strong>Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills?.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <strong>Certifications:</strong>
            <div className="mt-2 space-y-2">
              {user.Certifications?.map((cert, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{cert.title}</div>
                  <div className="text-sm text-gray-600">{cert.issuer} • {cert.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Degree</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
            </select>
            <input
              name="yearOfPassing"
              type="number"
              value={formData.yearOfPassing}
              onChange={handleInputChange}
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="CGPA"
              value={formData.CGPA}
              onChange={handleInputChange}
              placeholder="CGPA"
              className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add skill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2">×</button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}
    </div>
  );
};