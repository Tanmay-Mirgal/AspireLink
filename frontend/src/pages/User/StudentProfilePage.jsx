import { AcademicInfo } from "@/components/studentProfile/AcademicInfo";
import { AchievementList } from "@/components/studentProfile/AchievementList";
import { CourseList } from "@/components/studentProfile/CourseList";
import { ProfileHeader } from "@/components/studentProfile/ProfileHeader";
import { SkillsList } from "@/components/studentProfile/SkillList";


const defaultStudent = {
  id: 'S12345',
  name: 'Emily Rodriguez',
  email: 'emily.rodriguez@university.edu',
  major: 'Computer Science',
  graduationYear: 2026,
  gpa: 3.85,
  profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  contactInfo: {
    address: 'Cambridge, MA'
  },
  academicDetails: {
    department: 'School of Engineering',
    scholarships: ['Dean\'s List', 'Tech Innovation Grant']
  },
  courses: [
    { code: 'CS 301', name: 'Advanced Algorithms', credits: 4 },
    { code: 'CS 350', name: 'Machine Learning', credits: 3 },
    { code: 'CS 250', name: 'Data Structures', credits: 4 }
  ],
  achievements: [
    'Research Assistant - AI Lab',
    'Hackathon Winner 2024',
    'Published Research Paper'
  ],
  skills: [
    'Python', 'React', 'Machine Learning', 
    'Data Structures', 'Algorithm Design'
  ]
};

export default function StudentProfile({ student }) {
  const studentData = { ...defaultStudent, ...student };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 ml-6">
      <ProfileHeader student={studentData} />
      
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <AcademicInfo student={studentData} />
            <SkillsList student={studentData} />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <CourseList student={studentData} />
            <AchievementList student={studentData} />
          </div>
        </div>
      </div>
    </div>
  );
}