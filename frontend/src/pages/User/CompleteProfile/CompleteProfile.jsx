import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { X, Plus } from 'lucide-react';

const DetailedProfileForm = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuthStore();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    profilePic: '',
    skills: [{ name: '', proficiency: 5, yearsOfExperience: 0 }],
    education: [{ 
      degree: '', 
      institution: '', 
      graduationYear: new Date().getFullYear() 
    }],
    socialMedia: {
      github: '',
      leetcode: '',
      linkedIn: ''
    }
  });

  // Generic input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Social media input change handler
  const handleSocialMediaChange = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  // Handle changes in skills array
  const handleSkillChange = (index, field, value) => {
    setProfile(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = {
        ...updatedSkills[index],
        [field]: field === 'proficiency' ? value[0] : value
      };
      return { ...prev, skills: updatedSkills };
    });
  };

  // Handle changes in education array
  const handleEducationChange = (index, field, value) => {
    setProfile(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return { ...prev, education: updatedEducation };
    });
  };

  // Add a new skill
  const addSkill = () => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', proficiency: 5, yearsOfExperience: 0 }]
    }));
  };

  // Remove a skill
  const removeSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Add a new education entry
  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { 
        degree: '', 
        institution: '', 
        graduationYear: new Date().getFullYear() 
      }]
    }));
  };

  // Remove an education entry
  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!profile.firstName || !profile.lastName) {
      toast.error('First Name and Last Name are required');
      return;
    }

    try {
      // Clean up and validate skills
      const cleanedProfile = {
        ...profile,
        skills: profile.skills.filter(skill => skill.name.trim() !== ''),
        education: profile.education.filter(edu => 
          edu.degree.trim() !== '' && edu.institution.trim() !== ''
        )
      };

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

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            {profile.skills.map((skill, index) => (
              <div key={index} className="space-y-2 mb-4 p-4 border rounded-md">
                <div className="flex items-center space-x-2">
                  <Input 
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    placeholder="Skill name (e.g., Python)"
                    className="flex-grow"
                  />
                  {index > 0 && (
                    <Button 
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proficiency (1-10)
                  </label>
                  <Slider 
                    defaultValue={[skill.proficiency]}
                    onValueChange={(value) => handleSkillChange(index, 'proficiency', value)}
                    max={10}
                    step={1}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Current level: {skill.proficiency}/10
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <Input 
                    type="number"
                    value={skill.yearsOfExperience}
                    onChange={(e) => handleSkillChange(index, 'yearsOfExperience', e.target.value)}
                    placeholder="Years of experience"
                    min="0"
                    max="20"
                  />
                </div>
              </div>
            ))}
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addSkill}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education
            </label>
            {profile.education.map((edu, index) => (
              <div key={index} className="space-y-2 mb-4 p-4 border rounded-md">
                <div className="flex items-center space-x-2">
                  <Input 
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    placeholder="Degree (e.g., Bachelor of Science)"
                    className="flex-grow"
                  />
                  {index > 0 && (
                    <Button 
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeEducation(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <Input 
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="Institution Name"
                  className="mt-2"
                />
                
                <Input 
                  type="number"
                  value={edu.graduationYear}
                  onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                  placeholder="Graduation Year"
                  min="1900"
                  max="2030"
                  className="mt-2"
                />
              </div>
            ))}
            <Button 
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addEducation}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </div>

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Media Profiles
            </label>
            <div className="space-y-2">
              <Input 
                type="url"
                value={profile.socialMedia.github}
                onChange={(e) => handleSocialMediaChange('github', e.target.value)}
                placeholder="GitHub Profile URL"
                className="mt-2"
              />
              <Input 
                type="url"
                value={profile.socialMedia.leetcode}
                onChange={(e) => handleSocialMediaChange('leetcode', e.target.value)}
                placeholder="LeetCode Profile URL"
                className="mt-2"
              />
              <Input 
                type="url"
                value={profile.socialMedia.linkedIn}
                onChange={(e) => handleSocialMediaChange('linkedIn', e.target.value)}
                placeholder="LinkedIn Profile URL"
                className="mt-2"
              />
            </div>
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

export default DetailedProfileForm;