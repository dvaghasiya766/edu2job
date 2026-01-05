import React, { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  degree: string;
  yearOfPassing: number;
  skills: string[];
  CGPA: string;
  Certifications: any[];
}

interface SimpleUserProfileFormProps {
  initialData?: UserProfile;
  onSubmit: (data: UserProfile) => void;
  loading?: boolean;
}

export const SimpleUserProfileForm: React.FC<SimpleUserProfileFormProps> = ({
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

  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState({ title: '', issuer: '', year: new Date().getFullYear() });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        degree: initialData.degree || '',
        yearOfPassing: initialData.yearOfPassing || new Date().getFullYear(),
        skills: initialData.skills || [],
        CGPA: initialData.CGPA || '',
        Certifications: initialData.Certifications || []
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearOfPassing' ? parseInt(value) : value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddCertification = () => {
    if (newCert.title.trim() && newCert.issuer.trim()) {
      setFormData(prev => ({
        ...prev,
        Certifications: [...prev.Certifications, newCert]
      }));
      setNewCert({ title: '', issuer: '', year: new Date().getFullYear() });
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      Certifications: prev.Certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      Certifications: formData.Certifications.map(cert => ({
        title: cert.title,
        issuer: cert.issuer,
        year: cert.year
      }))
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* Skills Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                type="text"
                value={newCert.title}
                onChange={(e) => setNewCert(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Certification title"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newCert.issuer}
                onChange={(e) => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                placeholder="Issuing organization"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={newCert.year}
                onChange={(e) => setNewCert(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                min="2000"
                max={currentYear + 1}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCertification}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.Certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium">{cert.title}</div>
                    <div className="text-sm text-gray-600">{cert.issuer} • {cert.year}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
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