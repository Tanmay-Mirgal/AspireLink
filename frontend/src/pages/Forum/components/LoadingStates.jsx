import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const LoadingStates = ({ type, count = 1 }) => {
  const renderForumListSkeleton = () => {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[70%] bg-gray-700" />
          <Skeleton className="h-3 w-[40%] bg-gray-700" />
        </div>
      </div>
    ));
  };

  const renderMessagesSkeleton = () => {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'justify-end'}`}>
        {i % 2 === 0 && <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />}
        <div className={`max-w-[70%] ${i % 2 === 0 ? 'order-2' : 'order-1'}`}>
          <Skeleton className={`h-16 w-[200px] rounded-lg ${i % 2 === 0 ? 'bg-gray-700' : 'bg-indigo-900'}`} />
          <div className="flex mt-1 gap-2">
            {i % 2 === 0 && <Skeleton className="h-3 w-20 bg-gray-700" />}
            <Skeleton className="h-3 w-16 bg-gray-700" />
          </div>
        </div>
      </div>
    ));
  };

  switch (type) {
    case 'forum-list':
      return renderForumListSkeleton();
    case 'messages':
      return renderMessagesSkeleton();
    default:
      return null;
  }
};

export default LoadingStates;