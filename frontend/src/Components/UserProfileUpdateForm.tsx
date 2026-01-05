import React, { useState, useEffect } from 'react';
import EnhancedSkillsManager from './EnhancedSkillsManager';
import EnhancedCertificationsManager from './EnhancedCertificationsManager';

interface UserProfile {
  name: string;
  degree: string;
  yearOfPassing: number;
  skills: string[];
  CGPA: string;
  Certifications: any[];
}

interface UserProfileUpdateFormProps {
  initialData?: UserProfile;
  onSubmit: (data: UserProfile) => void;
  loading?: boolean;
}

export const UserProfileUpdateForm: React.FC<UserProfileUpdateFormProps> = ({
  initialData,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    degree: '',
    yearOfPassing: new Date().getFullYear(),
    skills: [],
    CGPA: '',
    Certifications: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearOfPassing' ? parseInt(value) : value
    }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleCertificationsChange = (certifications: any[]) => {
    setFormData(prev => ({ ...prev, Certifications: certifications }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
            Degree
          </label>
          <select
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.E">B.E</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="M.Tech">M.Tech</option>
            <option value="MBA">MBA</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="yearOfPassing" className="block text-sm font-medium text-gray-700 mb-2">
            Year of Passing
          </label>
          <select
            id="yearOfPassing"
            name="yearOfPassing"
            value={formData.yearOfPassing}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="CGPA" className="block text-sm font-medium text-gray-700 mb-2">
            CGPA
          </label>
          <input
            type="text"
            id="CGPA"
            name="CGPA"
            value={formData.CGPA}
            onChange={handleInputChange}
            placeholder="e.g., 8.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <EnhancedSkillsManager
            skills={formData.skills}
            onSkillsChange={handleSkillsChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications
          </label>
          <EnhancedCertificationsManager
            certifications={formData.Certifications}
            onCertificationsChange={handleCertificationsChange}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};