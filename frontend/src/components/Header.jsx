import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-sm h-16">
            <div className="flex flex-grow items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Hamburger Button (Mobile) */}
                <div className="flex items-center lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center ml-auto space-x-4">
                    {/* Notifications */}
                    <button className="relative text-gray-400 hover:text-gray-500">
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        <Bell size={20} />
                    </button>

                    {/* User Profile / Logout */}
                    <div className="relative group">
                        <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="hidden sm:block font-medium">{user?.name || 'User'}</span>
                        </button>
                        {/* Dropdown (Simplified) */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border border-gray-100">
                            <button
                                onClick={logout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
