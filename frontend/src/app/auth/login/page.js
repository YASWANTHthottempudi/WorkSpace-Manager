'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const { login, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm =() =>{
        const newErrors = {};

        if (!formData.email){
            newErrors.email = "Email is required";
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
          }

          if (!formData.password) {
            newErrors.password = 'Password is required';
          } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null,
            }));
        };

    }; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateForm()) return;
        setIsLoading(true);

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            router.push('/dashboard');
        } else {
            setErrors({ ...errors, general: result.error || 'Login failed' });
        }
        
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 sm:py-12">
          <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            {/* Logo/Header */}
            <div className="text-center">
              <img 
                src="/images/icons/logo.svg" 
                alt="AI Workspace" 
                className="mx-auto h-12 mb-4"
              />
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-600">
                Sign in to your account
              </p>
            </div>
    
            {/* Error Message */}
            {(authError || errors.general) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {authError || errors.general}
              </div>
            )}
    
    {/* Login Form */}
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
    );
        
}