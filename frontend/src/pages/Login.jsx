import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Lock, Mail, ArrowRight, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // Navigation is handled by AuthContext or protected route, 
            // but explicitly redirecting here can be safer if context doesn't auto-redirect
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            // Toast is handled in context usually, but added here for safety if context doesn't
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-200/30 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md z-10 p-4">
                <div className="card border-0 shadow-soft bg-white/80 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4 text-primary-600 shadow-sm border border-primary-100">
                            <BookOpen size={32} />
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-2">Welcome Back</h1>
                        <p className="text-secondary-500">Sign in to your EduSphere dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10 h-11 bg-secondary-50 border-transparent focus:bg-white transition-all"
                                    placeholder="admin@edusphere.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1.5 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-10 h-11 bg-secondary-50 border-transparent focus:bg-white transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-600 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary h-11 text-base group relative overflow-hidden"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign in
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-secondary-500">
                        <p>Don't have an account? <a href="#" className="font-medium text-primary-600 hover:text-primary-500 hover:underline">Contact Support</a></p>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-secondary-400">
                    &copy; {new Date().getFullYear()} EduSphere Management System. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
