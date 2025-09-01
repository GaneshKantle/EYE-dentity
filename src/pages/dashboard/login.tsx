import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
// Icon is now served from public directory

interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();


  // Store login fields in localStorage only for now
  // API endpoint (commented): POST /api/auth/login
  const onSubmit = async (data: LoginForm) => {
    localStorage.setItem('loginEmail', data.email);
    localStorage.setItem('loginPassword', data.password); // Not recommended for production

    // Set dummy auth so ProtectedRoute allows dashboard
    setAuth({
      id: 'demo',
      email: data.email,
      username: data.email.split('@')[0],
      createdAt: new Date().toISOString(),
    }, 'dummy-token');

    try {
      navigate(from, { replace: true });
    } catch (error) {
      // Log error for debugging
      console.error('Login navigation error:', error);
    }

    // Uncomment below to call API when ready
    // setIsLoading(true);
    // try {
    //   const response = await authAPI.login(data); // Calls /api/auth/login
    //   setAuth(response.user, response.token);
    //   toast({
    //     title: 'Welcome back!',
    //     description: 'Successfully logged in to EYE\'dentify.',
    //   });
    //   navigate(from, { replace: true });
    // } catch (error: any) {
    //   console.error('Login API error:', error);
    //   toast({
    //     variant: 'destructive',
    //     title: 'Login failed',
    //     description: error.response?.data?.message || 'Invalid email or password',
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-8 shadow-lg">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 flex items-center justify-center mb-4"
            >
              <img 
                src="/icon.png" 
                alt="EYE'dentify Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your EYE'dentify account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-white border-amber-200 text-gray-800 focus:border-red-300 focus:ring-red-200"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="bg-white border-amber-200 text-gray-800 focus:border-red-300 focus:ring-red-200 pr-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;