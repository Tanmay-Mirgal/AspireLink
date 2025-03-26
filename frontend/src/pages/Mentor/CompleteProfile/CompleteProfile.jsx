import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { X, Plus } from 'lucide-react';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuthStore();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    profilePic: '',
    companyName: '',
    description: '',
    qualifications: [''],
    experience: '',
    skills: [''],
    projects: [''],
    contact: '',
    portfolio: '',
    availableForMentorship: false
  });

  // Generic input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle changes in array fields
  const handleArrayChange = (field, index, value) => {
    setProfile(prev => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  // Add a new field to array
  const addArrayField = (field) => {
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove a field from array
  const removeArrayField = (field, index) => {
    setProfile(prev => {
      const updatedArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updatedArray };
    });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!profile.firstName || !profile.lastName) {
      toast.error('First Name and Last Name are required');
      return;
    }

    // Clean up empty array entries
    const cleanedProfile = {
      ...profile,
      qualifications: profile.qualifications.filter(q => q.trim() !== ''),
      skills: profile.skills.filter(s => s.trim() !== ''),
      projects: profile.projects.filter(p => p.trim() !== '')
    };

    try {
      // Complete profile
      await completeProfile(cleanedProfile);
      
      // Navigate to appropriate dashboard
      navigate(`/${user.role}-dashboard`);
    } catch (error) {
      console.error('Profile completion error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <Input 
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <Input 
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea 
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL
            </label>
            <Input 
              type="url"
              name="profilePic"
              value={profile.profilePic}
              onChange={handleInputChange}
              placeholder="https://example.com/your-profile-pic.jpg"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <Input 
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleInputChange}
              placeholder="Your current company"
            />
          </div>

          {/* Professional Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Description
            </label>
            <textarea 
              name="description"
              value={profile.description}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
              placeholder="Brief professional summary"
              rows={3}
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications
            </label>
            {profile.qualifications.map((qual, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input 
                  type="text"
                  value={qual}
                  onChange={(e) => handleArrayChange('qualifications', index, e.target.value)}
                  placeholder="Add qualification"
                  className="flex-grow"
                />
                {index > 0 && (
                  <Button 
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayField('qualifications', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayField('qualifications')}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Qualification
            </Button>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience
            </label>
            <Input 
              type="text"
              name="experience"
              value={profile.experience}
              onChange={handleInputChange}
              placeholder="Years of experience"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            {profile.skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input 
                  type="text"
                  value={skill}
                  onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                  placeholder="Add skill"
                  className="flex-grow"
                />
                {index > 0 && (
                  <Button 
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayField('skills', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayField('skills')}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>

          {/* Projects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projects
            </label>
            {profile.projects.map((project, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input 
                  type="text"
                  value={project}
                  onChange={(e) => handleArrayChange('projects', index, e.target.value)}
                  placeholder="Add project"
                  className="flex-grow"
                />
                {index > 0 && (
                  <Button 
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayField('projects', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayField('projects')}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <Input 
              type="email"
              name="contact"
              value={profile.contact}
              onChange={handleInputChange}
              placeholder="Your contact email"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio URL
            </label>
            <Input 
              type="url"
              name="portfolio"
              value={profile.portfolio}
              onChange={handleInputChange}
              placeholder="Your portfolio website"
            />
          </div>

          {/* Mentorship Availability */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="availableForMentorship"
              name="availableForMentorship"
              checked={profile.availableForMentorship}
              onCheckedChange={(checked) => setProfile(prev => ({
                ...prev,
                availableForMentorship: !!checked
              }))}
            />
            <label 
              htmlFor="availableForMentorship"
              className="text-sm font-medium leading-none"
            >
              Available for Mentorship
            </label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full mt-6"
          >
            Complete Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfilePage;