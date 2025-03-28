// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import MinimalistSidebar from '@/components/sidebar/ModernNavbar';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAccepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuthStore();
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!formData.termsAccepted) {
      toast.error('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    try {
      setIsSubmitting(true);
      const { firstName, lastName, email, password } = formData;
      const user = await signup({ firstName, lastName, email, password });
      
      // Optional: Navigate to dashboard or profile page after signup
      navigate('/role');
    } catch (error) {
      // Error handling is done in the signup function via toast
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <MinimalistSidebar/>
    <div className="flex min-h-screen w-full">
      {/* Left side - Signup form */}
      <div className="flex w-full md:w-1/2 flex-col items-start justify-center px-8 md:px-12 lg:px-16 ml-6">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center rounded bg-blue-600 text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-600">TreeTex</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-1">Create your Account</h1>
          <p className="text-gray-500 mb-6">Welcome! Fill in your details to get started:</p>

          <div className="flex gap-4 mb-4">
            <Button variant="outline" className="flex-1 py-5 font-normal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#4285F4" className="mr-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="flex-1 py-5 font-normal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" className="mr-2">
                <path d="M24 12.073c0-5.8-4.698-10.5-10.498-10.5s-10.5 4.7-10.5 10.5c0 5.242 3.837 9.584 8.842 10.375v-7.344h-2.656v-3.031h2.656v-2.308c0-2.624 1.563-4.074 3.948-4.074 1.144 0 2.340.205 2.340.205v2.574h-1.318c-1.3 0-1.704.807-1.704 1.635v1.968h2.9l-.463 3.031h-2.437v7.344c5.005-.79 8.84-5.132 8.84-10.375z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-500">or continue with email</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input 
                  type="text" 
                  name="firstName"
                  placeholder="First Name" 
                  className="py-5"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Input 
                  type="text" 
                  name="lastName"
                  placeholder="Last Name" 
                  className="py-5"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  termsAccepted: !!checked
                }))}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-5 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
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
          <p className="text-blue-100">Everything you need in an easily customizable       dashboard.</p>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignupPage;