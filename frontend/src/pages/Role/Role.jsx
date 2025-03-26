import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

// Icons can be imported from lucide-react or custom SVGs
import { BookOpen, GraduationCap } from 'lucide-react';

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const { user, setRole, isLoading } = useAuthStore();

  // Check if user already has a role or is logged in
  useEffect(() => {
    if (user?.role) {
      // If user already has a role, redirect to appropriate dashboard
      navigate(`/${selectedRole}-dashboard`);
    }
  }, [user, navigate]);

  const roles = [
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Guide and support learners in their educational journey',
      icon: GraduationCap,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      id: 'student',
      name: 'Student',
      description: 'Learn, grow, and explore new knowledge',
      icon: BookOpen,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    try {
      // Use the setRole method from the auth store
      const updatedUser = await setRole(selectedRole);
      
      // Navigate based on selected role
      navigate(`/${user.role}-complete-profile`);
      
      toast.success(`Welcome as a ${selectedRole}!`);
    } catch (error) {
      console.error('Role selection error:', error);
      // Error handling is done in the store's setRole method via toast
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Choose Your Role
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select the role that best describes your current journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div 
              key={role.id}
              className={`
                cursor-pointer 
                border-2 
                rounded-xl 
                p-6 
                text-center 
                transition-all 
                duration-300 
                ${selectedRole === role.id 
                  ? `${role.bgColor} ${role.textColor} border-current` 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex justify-center mb-4">
                <role.icon 
                  size={48} 
                  className={
                    selectedRole === role.id 
                      ? 'text-current' 
                      : 'text-gray-400 group-hover:text-gray-500'
                  }
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{role.name}</h3>
              <p className="text-sm text-gray-600">
                {role.description}
              </p>
              {selectedRole === role.id && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white">
                    Selected
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className="w-full max-w-md py-3 bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Updating...' : 'Continue'}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          Not sure? You can always change your role later in settings.
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;

// // Optional: Role-based Route Protection Component
// export const RoleProtectedRoute = ({ allowedRoles, children }) => {
//   const { user } = useAuthStore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Redirect to role selection if no role is set
//     if (!user || !user.role) {
//       navigate('/select-role');
//       return;
//     }

//     // Redirect if user's role is not allowed
//     if (!allowedRoles.includes(user.role)) {
//       navigate('/unauthorized');
//     }
//   }, [user, navigate, allowedRoles]);

//   // Render children only if user has an allowed role
//   return user?.role && allowedRoles.includes(user.role) ? children : null;
// };

// Example of how to use RoleProtectedRoute in App.js or routing
/*
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route 
          path="/mentor-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={['mentor']}>
              <MentorDashboard />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </RoleProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
*/