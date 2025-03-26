
export function AchievementList({ student }) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h2 className="text-lg font-medium text-zinc-100 mb-4">Achievements</h2>
      <div className="grid gap-4">
        {student.achievements.map((achievement, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 text-zinc-300"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
            <span className="leading-relaxed">{achievement}</span>
          </div>
        ))}
      </div>
    </div>
  );
}