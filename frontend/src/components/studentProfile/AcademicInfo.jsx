import { BookOpen } from "lucide-react";


export function AcademicInfo({ student }) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h2 className="flex items-center gap-2 text-lg font-medium text-zinc-100 mb-4">
        <BookOpen className="w-5 h-5 text-purple-400" />
        Academic Information
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Student ID</span>
          <span className="text-zinc-200">{student.id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">GPA</span>
          <span className="text-zinc-200">{student.gpa.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Department</span>
          <span className="text-zinc-200">{student.academicDetails.department}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Expected Graduation</span>
          <span className="text-zinc-200">{student.graduationYear}</span>
        </div>
      </div>
    </div>
  );
}