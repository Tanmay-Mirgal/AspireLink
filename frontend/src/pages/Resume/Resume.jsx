import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeBuilder = () => {
  const [template, setTemplate] = useState('professional');
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      photo: ''
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    certifications: []
  });
  
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [currentWorkExperience, setCurrentWorkExperience] = useState({
    position: '',
    company: '',
    location: '',
    duration: '',
    achievements: ''
  });
  const [currentEducation, setCurrentEducation] = useState({
    degree: '',
    school: '',
    location: '',
    year: '',
    gpa: '',
    achievements: ''
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCertification, setCurrentCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    id: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  
  const componentRef = useRef();

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value
      }
    });
  };
  
  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData({
          ...resumeData,
          personalInfo: {
            ...resumeData.personalInfo,
            photo: event.target.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove uploaded photo
  const removePhoto = () => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        photo: ''
      }
    });
  };

  // Handle summary changes
  const handleSummaryChange = (e) => {
    setResumeData({
      ...resumeData,
      summary: e.target.value
    });
  };

  // Handle work experience input changes
  const handleWorkExperienceChange = (e) => {
    const { name, value } = e.target;
    setCurrentWorkExperience({
      ...currentWorkExperience,
      [name]: value
    });
  };

  // Add work experience
  const addWorkExperience = () => {
    // Format achievements as an array of bullet points
    const achievements = currentWorkExperience.achievements
      .split('\n')
      .filter(item => item.trim() !== '');

    const newExperience = {
      ...currentWorkExperience,
      achievements
    };

    setResumeData({
      ...resumeData,
      workExperience: [...resumeData.workExperience, newExperience]
    });

    // Reset form
    setCurrentWorkExperience({
      position: '',
      company: '',
      location: '',
      duration: '',
      achievements: ''
    });
  };

  // Handle education input changes
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setCurrentEducation({
      ...currentEducation,
      [name]: value
    });
  };

  // Add education
  const addEducation = () => {
    // Format achievements as an array if any
    const achievements = currentEducation.achievements
      ? currentEducation.achievements.split('\n').filter(item => item.trim() !== '')
      : [];

    const newEducation = {
      ...currentEducation,
      achievements
    };

    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    });

    // Reset form
    setCurrentEducation({
      degree: '',
      school: '',
      location: '',
      year: '',
      gpa: '',
      achievements: ''
    });
  };

  // Handle skill changes
  const handleSkillChange = (e) => {
    setCurrentSkill(e.target.value);
  };

  // Add skill
  const addSkill = () => {
    if (currentSkill.trim() !== '') {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, currentSkill]
      });
      setCurrentSkill('');
    }
  };

  // Handle certification changes
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setCurrentCertification({
      ...currentCertification,
      [name]: value
    });
  };

  // Add certification
  const addCertification = () => {
    if (currentCertification.name.trim() !== '') {
      setResumeData({
        ...resumeData,
        certifications: [...resumeData.certifications, currentCertification]
      });
      setCurrentCertification({
        name: '',
        issuer: '',
        date: '',
        id: ''
      });
    }
  };

  // Remove item from an array in resumeData
  const removeItem = (section, index) => {
    const updatedArray = [...resumeData[section]];
    updatedArray.splice(index, 1);
    setResumeData({
      ...resumeData,
      [section]: updatedArray
    });
  };

  // Fixed Export as PDF Function - Enhanced for image support
  const exportAsPDF = async () => {
    setIsExporting(true);
    
    try {
      const element = componentRef.current;
      
      // Store original styles and set up for PDF
      const originalStyle = element.style.cssText;
      
      // Apply styles that will make PDF capture better
      element.style.width = '816px'; // A4 width in pixels at 96 DPI
      element.style.background = 'white';
      element.style.padding = '20px';
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      element.style.zIndex = '-9999';
      
      // Add to DOM for rendering
      document.body.appendChild(element);

      // Ensure images are loaded before capturing
      const images = element.querySelectorAll('img');
      await Promise.all([...images].map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
      
      // Create canvas with A4 dimensions
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        imageTimeout: 15000, // Increased timeout for image loading
        onclone: (clonedDoc) => {
          // Additional handling for the cloned document if needed
          const clonedElement = clonedDoc.body.querySelector('[data-for-pdf="true"]');
          if (clonedElement) {
            clonedElement.style.width = '100%';
            clonedElement.style.height = 'auto';
            clonedElement.style.position = 'static';
          }
        }
      });
      
      // Remove from DOM and restore original styles
      document.body.removeChild(element);
      element.style.cssText = originalStyle;
      
      // Create PDF with A4 dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`${resumeData.personalInfo.name || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Templates
  // 1. Professional Template
  const ProfessionalTemplate = ({ data }) => (
    <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 font-sans">
      <header className="pb-6 border-b-2 border-gray-300 flex flex-wrap justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{data.personalInfo.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-700">
            {data.personalInfo.email && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-1-.02-2.288-1.39-2.288-1.39 0-1.6 1.09-1.6 2.215v4.25H8.014v-8.59h2.557v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                </svg>
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                </svg>
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
        {data.personalInfo.photo && (
          <div className="ml-auto">
            <img 
              src={data.personalInfo.photo} 
              alt="Profile" 
              className="w-24 h-24 rounded-lg object-cover border border-gray-300"
            />
          </div>
        )}
      </header>

      {data.summary && (
        <section className="mt-6 mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800 uppercase">Professional Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800 uppercase">Work Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-800">{exp.position}</h3>
                <span className="text-gray-600">{exp.duration}</span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-gray-700 font-semibold">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
              </div>
              <ul className="list-disc list-outside ml-5 text-gray-700">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="mb-1">{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800 uppercase">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                <span className="text-gray-600">{edu.year}</span>
              </div>
              <p className="text-gray-700 font-semibold mb-1">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
              {edu.gpa && <p className="text-gray-600 mb-1">GPA: {edu.gpa}</p>}
              {edu.achievements.length > 0 && (
                <ul className="list-disc list-outside ml-5 text-gray-700">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800 uppercase">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800 uppercase">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                {cert.date && <span className="text-gray-600">{cert.date}</span>}
              </div>
              <p className="text-gray-700">{cert.issuer}</p>
              {cert.id && <p className="text-gray-600 text-sm">Credential ID: {cert.id}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );

  // 2. Minimal Template
  const MinimalTemplate = ({ data }) => (
    <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 font-sans">
      <header className="text-center mb-8">
        {data.personalInfo.photo && (
          <div className="mb-4">
            <img 
              src={data.personalInfo.photo} 
              alt="Profile" 
              className="w-24 h-24 mx-auto rounded-full object-cover border border-gray-200 shadow"
            />
          </div>
        )}
        <h1 className="text-3xl font-light mb-2">{data.personalInfo.name}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-700">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-8 border-b pb-6">
          <p className="text-center text-gray-700">{data.summary}</p>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-light mb-4 text-center border-b pb-2">EXPERIENCE</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-baseline mb-2">
                <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                <div className="text-gray-600">
                  <span className="font-light">{exp.company}</span>
                  <span className="mx-2">|</span>
                  <span>{exp.duration}</span>
                </div>
              </div>
              <ul className="list-inside text-gray-700">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="mb-1">• {achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xl font-light mb-4 text-center border-b pb-2">EDUCATION</h2>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-gray-700">{edu.school}, {edu.year}</p>
                {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        )}

        <div>
          {data.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-light mb-4 text-center border-b pb-2">SKILLS</h2>
              <div className="flex flex-wrap">
                {data.skills.map((skill, index) => (
                  <span key={index} className="text-gray-700 after:content-[','] after:mr-1 last:after:content-[''] mr-1">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-light mb-4 text-center border-b pb-2">CERTIFICATIONS</h2>
              {data.certifications.map((cert, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}{cert.date ? `, ${cert.date}` : ''}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );

  // 3. ATS-Optimized Template
  const ATSTemplate = ({ data }) => (
    <div className="max-w-2xl mx-auto p-8 bg-white text-black font-sans">
      <header className="mb-6 flex flex-wrap items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">{data.personalInfo.name}</h1>
          <div className="text-sm space-y-1">
            {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
            {data.personalInfo.website && <div>{data.personalInfo.website}</div>}
          </div>
        </div>
        {data.personalInfo.photo && (
          <div>
            <img 
              src={data.personalInfo.photo} 
              alt="Profile" 
              className="w-20 h-20 object-cover"
            />
          </div>
        )}
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2 uppercase">Summary</h2>
          <p>{data.summary}</p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2 uppercase">Skills</h2>
          <p>{data.skills.join(', ')}</p>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2 uppercase">Work Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div>
                <span className="font-bold">{exp.position}</span>
                {exp.company && <span>, {exp.company}</span>}
                {exp.location && <span>, {exp.location}</span>}
                {exp.duration && <span>, {exp.duration}</span>}
              </div>
              <ul className="list-disc ml-5">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2 uppercase">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <div>
                <span className="font-bold">{edu.degree}</span>
                {edu.school && <span>, {edu.school}</span>}
                {edu.location && <span>, {edu.location}</span>}
                {edu.year && <span>, {edu.year}</span>}
              </div>
              {edu.gpa && <div>GPA: {edu.gpa}</div>}
              {edu.achievements.length > 0 && (
                <ul className="list-disc ml-5">
                  {edu.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold mb-2 uppercase">Certifications</h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-1">
              <span className="font-bold">{cert.name}</span>
              {cert.issuer && <span>, {cert.issuer}</span>}
              {cert.date && <span>, {cert.date}</span>}
              {cert.id && <span>, ID: {cert.id}</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  );

  // 4. Modern Template
  const ModernTemplate = ({ data }) => (
    <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 font-sans">
      <div className="grid grid-cols-4 gap-8">
        {/* Left sidebar */}
        <div className="col-span-1 bg-gray-100 p-4 rounded">
          <div className="mb-8">
            {data.personalInfo.photo ? (
              <img 
                src={data.personalInfo.photo}
                alt="Profile" 
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <img 
                src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23ccc'/%3E%3Cpath d='M36 40 A14 14 0 0 1 64 40 A14 14 0 0 1 36 40 Z' fill='%23fff'/%3E%3Cpath d='M32 65 A24 24 0 0 1 68 65 L68 80 A10 10 0 0 1 32 80 Z' fill='%23fff'/%3E%3C/svg%3E" 
                alt="Profile" 
                className="w-24 h-24 mx-auto rounded-full bg-gray-300"
              />
            )}
            <h1 className="text-xl font-bold text-center mt-4 mb-1">{data.personalInfo.name}</h1>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-sm uppercase mb-2 border-b border-gray-300 pb-1">Contact</h2>
              <div className="space-y-1 text-sm">
                {data.personalInfo.email && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span className="break-all">{data.personalInfo.email}</span>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    <span>{data.personalInfo.phone}</span>
                  </div>
                )}
                {data.personalInfo.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{data.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {data.skills.length > 0 && (
              <div>
                <h2 className="font-bold text-sm uppercase mb-2 border-b border-gray-300 pb-1">Skills</h2>
                <div className="space-y-1">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.certifications.length > 0 && (
              <div>
                <h2 className="font-bold text-sm uppercase mb-2 border-b border-gray-300 pb-1">Certifications</h2>
                <div className="space-y-2">
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-xs text-gray-600">{cert.issuer}{cert.date ? ` - ${cert.date}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-3">
          {data.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">PROFILE</h2>
              <p className="text-gray-700">{data.summary}</p>
            </section>
          )}

          {data.workExperience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">EXPERIENCE</h2>
              {data.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800">{exp.position}</h3>
                    <span className="text-gray-600 text-sm">{exp.duration}</span>
                  </div>
                  <p className="text-gray-700 font-semibold mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <ul className="list-disc list-outside ml-5 text-gray-700">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="mb-1">{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {data.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>
              {data.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                    <span className="text-gray-600 text-sm">{edu.year}</span>
                  </div>
                  <p className="text-gray-700">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
                  {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                  {edu.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-5 text-gray-700 mt-2">
                      {edu.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );

  // 5. Executive Template
  const ExecutiveTemplate = ({ data }) => (
    <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 font-sans">
      <header className="text-center mb-8">
        {data.personalInfo.photo && (
          <div className="mb-4">
            <img 
              src={data.personalInfo.photo}
              alt="Profile" 
              className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-gray-200 shadow"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.personalInfo.name}</h1>
        <div className="w-24 h-1 bg-gray-800 mx-auto my-4"></div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-700">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span>• {data.personalInfo.website}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-center">Executive Summary</h2>
          <div className="border-t border-b border-gray-300 py-4">
            <p className="text-gray-700 font-medium leading-relaxed">{data.summary}</p>
          </div>
        </section>
      )}

      {data.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-center">Professional Experience</h2>
          {data.workExperience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                  <span className="text-gray-600">{exp.duration}</span>
                </div>
                <p className="font-semibold text-gray-700 mb-3">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                <ul className="list-none text-gray-700 space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="pl-6 relative">
                      <span className="absolute left-0 top-2 w-2 h-2 bg-gray-800 rounded-full"></span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-center">Education</h2>
            <div className="border-t border-gray-300 pt-4">
              {data.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                  </div>
                  <p className="text-gray-700">{edu.school}</p>
                  <p className="text-gray-600 text-sm">{edu.year}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div>
          {data.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-center">Core Competencies</h2>
              <div className="border-t border-gray-300 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-gray-800 rounded-full mr-2"></span>
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {data.certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-center">Certifications</h2>
              <div className="border-t border-gray-300 pt-4">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="mb-2">
                    <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                    <p className="text-gray-700 text-sm">{cert.issuer}{cert.date ? ` | ${cert.date}` : ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const templates = {
    professional: ProfessionalTemplate,
    minimal: MinimalTemplate,
    ats: ATSTemplate,
    modern: ModernTemplate,
    executive: ExecutiveTemplate
  };

  const TemplateComponent = templates[template];

  const inputClasses = "mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const buttonClasses = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const cardClasses = "bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6";
  const tabClasses = "px-4 py-2 rounded-md text-sm font-medium cursor-pointer";
  const activeTabClasses = "bg-indigo-600 text-white";
  const inactiveTabClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              ATS-Optimized Resume Builder
            </span>
          </h1>
          <p className="text-xl text-gray-600">Create a professional, ATS-friendly resume in minutes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className={cardClasses}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Template</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(templates).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setTemplate(key)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      template === key
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-indigo-400 text-gray-600'
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Navigation */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveSection('personalInfo')}
                className={`${tabClasses} ${activeSection === 'personalInfo' ? activeTabClasses : inactiveTabClasses}`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveSection('summary')}
                className={`${tabClasses} ${activeSection === 'summary' ? activeTabClasses : inactiveTabClasses}`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveSection('experience')}
                className={`${tabClasses} ${activeSection === 'experience' ? activeTabClasses : inactiveTabClasses}`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveSection('education')}
                className={`${tabClasses} ${activeSection === 'education' ? activeTabClasses : inactiveTabClasses}`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveSection('skills')}
                className={`${tabClasses} ${activeSection === 'skills' ? activeTabClasses : inactiveTabClasses}`}
              >
                Skills
              </button>
              <button
                onClick={() => setActiveSection('certifications')}
                className={`${tabClasses} ${activeSection === 'certifications' ? activeTabClasses : inactiveTabClasses}`}
              >
                Certifications
              </button>
            </div>

            {/* Forms */}
            <div className={cardClasses}>
              {activeSection === 'personalInfo' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className={labelClasses}>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={resumeData.personalInfo.name}
                          onChange={handlePersonalInfoChange}
                          className={inputClasses}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={resumeData.personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className={inputClasses}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className={inputClasses}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Location</label>
                        <input
                          type="text"
                          name="location"
                          value={resumeData.personalInfo.location}
                          onChange={handlePersonalInfoChange}
                          className={inputClasses}
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={labelClasses}>Photo (optional)</label>
                        <div className="mt-1 flex flex-col items-center">
                          {resumeData.personalInfo.photo ? (
                            <div className="relative mb-4">
                              <img 
                                src={resumeData.personalInfo.photo} 
                                alt="Profile" 
                                className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={removePhoto}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs shadow-lg hover:bg-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4 bg-gray-50">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          <label className="block">
                            <span className="sr-only">Choose profile photo</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100
                                cursor-pointer"
                            />
                          </label>
                          <p className="mt-1 text-xs text-gray-500">
                            JPEG, PNG or GIF. Max 1MB.
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label className={labelClasses}>LinkedIn (optional)</label>
                        <input
                          type="text"
                          name="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={handlePersonalInfoChange}
                          className={inputClasses}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Website (optional)</label>
                        <input
                          type="text"
                          name="website"
                          value={resumeData.personalInfo.website}
                          onChange={handlePersonalInfoChange}
                          className={inputClasses}
                          placeholder="johndoe.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'summary' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h3>
                  <div>
                    <label className={labelClasses}>Summary</label>
                    <textarea
                      rows={4}
                      value={resumeData.summary}
                      onChange={handleSummaryChange}
                      className={inputClasses}
                      placeholder="Experienced software engineer with a strong background in developing scalable web applications and a passion for creating efficient, maintainable code."
                    />
                    <p className="mt-1 text-sm text-gray-500">A concise 3-4 sentence summary highlighting your background, key strengths, and career goals.</p>
                  </div>
                </div>
              )}

              {activeSection === 'experience' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>Job Title</label>
                      <input
                        type="text"
                        name="position"
                        value={currentWorkExperience.position}
                        onChange={handleWorkExperienceChange}
                        className={inputClasses}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Company</label>
                      <input
                        type="text"
                        name="company"
                        value={currentWorkExperience.company}
                        onChange={handleWorkExperienceChange}
                        className={inputClasses}
                        placeholder="Tech Company Inc."
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Location (optional)</label>
                      <input
                        type="text"
                        name="location"
                        value={currentWorkExperience.location}
                        onChange={handleWorkExperienceChange}
                        className={inputClasses}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={currentWorkExperience.duration}
                        onChange={handleWorkExperienceChange}
                        className={inputClasses}
                        placeholder="Jan 2020 - Present"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Achievements/Responsibilities</label>
                      <textarea
                        name="achievements"
                        rows={4}
                        value={currentWorkExperience.achievements}
                        onChange={handleWorkExperienceChange}
                        className={inputClasses}
                        placeholder="Developed a new feature that increased user engagement by 25%&#10;Led a team of 5 engineers to redesign the company's core API&#10;Reduced application load time by 40% through code optimization"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Add each accomplishment on a new line. Start with strong action verbs and include quantifiable results.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addWorkExperience}
                      className={buttonClasses}
                    >
                      Add Experience
                    </button>
                  </div>

                  {resumeData.workExperience.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-2">Added Experience</h4>
                      <div className="space-y-2">
                        {resumeData.workExperience.map((exp, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md flex justify-between">
                            <div>
                              <p className="font-medium">{exp.position} at {exp.company}</p>
                              <p className="text-sm text-gray-600">{exp.duration}</p>
                            </div>
                            <button 
                              onClick={() => removeItem('workExperience', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'education' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={currentEducation.degree}
                        onChange={handleEducationChange}
                        className={inputClasses}
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>School</label>
                      <input
                        type="text"
                        name="school"
                        value={currentEducation.school}
                        onChange={handleEducationChange}
                        className={inputClasses}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Location (optional)</label>
                      <input
                        type="text"
                        name="location"
                        value={currentEducation.location}
                        onChange={handleEducationChange}
                        className={inputClasses}
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Year</label>
                      <input
                        type="text"
                        name="year"
                        value={currentEducation.year}
                        onChange={handleEducationChange}
                        className={inputClasses}
                        placeholder="2020 - 2024"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>GPA (optional)</label>
                      <input
                        type="text"
                        name="gpa"
                        value={currentEducation.gpa}
                        onChange={handleEducationChange}
                        className={inputClasses}
                        placeholder="3.8/4.0"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Achievements (optional)</label>
                      <textarea
                        name="achievements"
                        rows={3}
                        value={currentEducation.achievements}
                        onChange={handleEducationChange}
                        className={inputClasses}
                        placeholder="Dean's List for 6 consecutive semesters&#10;Senior thesis: Machine Learning Applications in Healthcare&#10;Secretary of Computer Science Student Association"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Add each achievement on a new line
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addEducation}
                      className={buttonClasses}
                    >
                      Add Education
                    </button>
                  </div>

                  {resumeData.education.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-2">Added Education</h4>
                      <div className="space-y-2">
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md flex justify-between">
                            <div>
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-sm text-gray-600">{edu.school}, {edu.year}</p>
                            </div>
                            <button 
                              onClick={() => removeItem('education', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'skills' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>Skill</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={currentSkill}
                          onChange={handleSkillChange}
                          className={inputClasses}
                          placeholder="JavaScript"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className={buttonClasses}
                        >
                          Add
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Add technical skills, soft skills, and industry-specific keywords to help your resume pass ATS screening.
                      </p>
                    </div>

                    {resumeData.skills.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Added Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, index) => (
                            <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 flex items-center">
                              <span>{skill}</span>
                              <button 
                                className="ml-2 text-gray-500 hover:text-red-500"
                                onClick={() => removeItem('skills', index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'certifications' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>Certification Name</label>
                      <input
                        type="text"
                        name="name"
                        value={currentCertification.name}
                        onChange={handleCertificationChange}
                        className={inputClasses}
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Issuing Organization</label>
                      <input
                        type="text"
                        name="issuer"
                        value={currentCertification.issuer}
                        onChange={handleCertificationChange}
                        className={inputClasses}
                        placeholder="Amazon Web Services"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Date (optional)</label>
                      <input
                        type="text"
                        name="date"
                        value={currentCertification.date}
                        onChange={handleCertificationChange}
                        className={inputClasses}
                        placeholder="May 2023"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Credential ID (optional)</label>
                      <input
                        type="text"
                        name="id"
                        value={currentCertification.id}
                        onChange={handleCertificationChange}
                        className={inputClasses}
                        placeholder="ABC123XYZ"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addCertification}
                      className={buttonClasses}
                    >
                      Add Certification
                    </button>
                  </div>

                  {resumeData.certifications.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-2">Added Certifications</h4>
                      <div className="space-y-2">
                        {resumeData.certifications.map((cert, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-md flex justify-between">
                            <div>
                              <p className="font-medium">{cert.name}</p>
                              <p className="text-sm text-gray-600">{cert.issuer}{cert.date ? `, ${cert.date}` : ''}</p>
                            </div>
                            <button 
                              onClick={() => removeItem('certifications', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PDF Export Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={exportAsPDF}
                disabled={isExporting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export as PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Resume Preview</h3>
              <p className="mt-1 text-sm text-gray-500">
                Current template: <span className="font-medium">{template.charAt(0).toUpperCase() + template.slice(1)}</span>
              </p>
            </div>
            <div className="overflow-auto max-h-[800px]">
              <div ref={componentRef} data-for-pdf="true">
                <TemplateComponent data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;