
export function CourseList({ student }) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h2 className="text-lg font-medium text-zinc-100 mb-4">Current Courses</h2>
      <div className="grid gap-4">
        {student.courses.map((course, index) => (
          <div 
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-800/50 p-4 rounded-lg gap-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-purple-400 font-medium text-lg">{course.code}</span>
              <span className="text-zinc-300">{course.name}</span>
            </div>
            <span className="text-zinc-500 bg-zinc-800/50 px-3 py-1.5 rounded-full">
              {course.credits} Credits
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}