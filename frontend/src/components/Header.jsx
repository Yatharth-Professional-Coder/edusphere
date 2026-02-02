import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 flex w-full bg-white/80 backdrop-blur-md border-b border-secondary-200/60 h-20 transition-all duration-300">
            <div className="flex flex-grow items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left Side: Toggle & Title/Breadcrumb (Placeholder) */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-secondary-500 hover:text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1 transition-colors lg:hidden"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Search Bar (Optional/Hidden for now but good for UI balance) */}
                <div className="hidden md:flex items-center max-w-md w-full mx-4">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-xl leading-5 bg-secondary-50 placeholder-secondary-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm transition-all duration-200"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center ml-auto gap-3 sm:gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white animate-pulse"></span>
                        <Bell size={20} />
                    </button>

                    {/* Divider */}
                    <div className="h-8 w-px bg-secondary-200 hidden sm:block"></div>

                    {/* User Profile / Logout */}
                    <div className="relative group">
                        <button className="flex items-center gap-3 focus:outline-none p-1 rounded-xl hover:bg-secondary-50 transition-colors border border-transparent hover:border-secondary-100">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-700 font-bold ring-2 ring-white shadow-sm">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden sm:flex flex-col items-start mr-1">
                                <span className="text-sm font-semibold text-secondary-900 leading-tight">{user?.name || 'User'}</span>
                                <span className="text-[10px] font-medium text-secondary-500 uppercase tracking-wider">{user?.role || 'Guest'}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
