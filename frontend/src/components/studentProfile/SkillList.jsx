import { Trophy } from 'lucide-react';



export function SkillsList({ student }) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h2 className="flex items-center gap-2 text-lg font-medium text-zinc-100 mb-4">
        <Trophy className="w-5 h-5 text-purple-400" />
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {student.skills.map((skill, index) => (
          <span 
            key={index}
            className="bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}