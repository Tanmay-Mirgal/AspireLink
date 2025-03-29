import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import MinimalistSidebar from '../../components/sidebar/ModernNavbar'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login({
        email: formData.email,
        password: formData.password
      });
      
      // If remember me is checked, store email in localStorage
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      window.location.reload();
      navigate('/profile');
    } catch (error) {
      // Error handling is done in the login function via toast
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <>
    
    <div className="flex min-h-screen w-full">
       
      {/* Left side - Login form */}
      <div className="flex w-full md:w-1/2 flex-col items-start justify-start relative top-28 px-8 md:px-12 lg:px-16 ml-6">
        <div className="mb-5">
          <div className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center rounded bg-blue-600 text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-600">AspireLink</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-1">Log in to your Account</h1>
          <p className="text-gray-500 mb-6">Welcome back! Select method to log in:</p>


          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-500">or continue with email</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input 
                type="email" 
                name="email"
                placeholder="Email" 
                className="py-5"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="Password" 
                className="py-5"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    rememberMe: !!checked
                  }))}
                />
                <label 
                  htmlFor="rememberMe" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="text-sm text-blue-600">
                Forgot Password?
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-5 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Create an account</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Blue background with illustration */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 flex-col items-center justify-center p-12">
        <div className="relative w-full max-w-md">
          {/* Illustration */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full bg-blue-500 opacity-50"></div>
            <div className="absolute w-40 h-40 rounded-full border-4 border-blue-400 top-10 left-10"></div>
            <div className="absolute w-20 h-20 rounded-full bg-white top-20 right-20 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="absolute w-20 h-20 rounded-full bg-white bottom-20 left-20 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <div className="absolute w-20 h-20 rounded-full bg-white bottom-20 right-20 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
          </div>
          
          {/* Browser window mockup */}
          <div className="relative mt-40 bg-white rounded-lg shadow-lg p-4 z-10">
            <div className="flex items-center mb-4">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gray-100 h-4 w-full ml-4 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="ml-2">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mt-1"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="ml-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 mt-1"></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="ml-2">
                  <div className="h-4 bg-gray-200 rounded w-36"></div>
                  <div className="h-3 bg-gray-200 rounded w-28 mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-white mt-8">
          <h2 className="text-2xl font-bold mb-3">Connect with every application.</h2>
          <p className="text-blue-100">Everything you need in an easily customizable dashboard.</p>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-blue-300  rounded-full"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;