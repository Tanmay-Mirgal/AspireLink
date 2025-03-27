import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useForumStore } from '@/store/useFormStore';
import { ForumCard } from './components/ForumCard';
import { CreateForumModal } from './components/CreateForumModal';


const Forums = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { forums, isLoading, error, fetchAllForums } = useForumStore();

  useEffect(() => {
    fetchAllForums();
  }, [fetchAllForums]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Forums</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Create Forum
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forums.map((forum) => (
          <ForumCard
            key={forum._id}
            id={forum._id}
            title={forum.title}
            description={forum.description}
            memberCount={forum.members.length}
          />
        ))}
      </div>

      <CreateForumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
export default Forums;