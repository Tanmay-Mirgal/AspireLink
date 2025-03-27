import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from 'lucide-react';

const EmptyState = ({ type, title, description, action, actionText }) => {
  const getIcon = () => {
    switch (type) {
      case 'no-messages':
        return <MessageSquare className="h-12 w-12 text-gray-600 mb-2" />;
      case 'join-forum':
        return <User className="h-16 w-16 text-gray-600 mb-4" />;
      case 'select-forum':
      default:
        return <MessageSquare className="h-16 w-16 text-gray-600 mb-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      {getIcon()}
      <h3 className="text-xl font-medium mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      {action && actionText && (
        <Button 
          onClick={action}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;