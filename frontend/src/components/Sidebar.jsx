import { Link, useLocation } from 'react-router-dom';
import {
    School,
    Users,
    GraduationCap,
    Banknote,
    CalendarCheck,
    Building2,
    LayoutDashboard,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['superadmin', 'admin', 'teacher'] },
        { icon: School, label: 'Schools', path: '/schools', roles: ['superadmin'] },
        { icon: Building2, label: 'Classes', path: '/classes', roles: ['admin'] },
        { icon: Users, label: 'Teachers', path: '/teachers', roles: ['admin'] },
        { icon: GraduationCap, label: 'Students', path: '/students', roles: ['admin'] },
        { icon: CalendarCheck, label: 'Attendance', path: '/attendance', roles: ['admin', 'teacher'] },
        { icon: Banknote, label: 'Fees', path: '/fees', roles: ['admin'] },
        { icon: CalendarCheck, label: 'Homework', path: '/homework', roles: ['teacher'] },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    // Filter items based on user role
    const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-secondary-200/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 transition-all duration-300">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-4 border-b border-secondary-100">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-50">
                    <Building2 size={24} className="stroke-[2.5]" />
                </div>
                <div>
                    <h1 className="font-heading font-bold text-xl text-secondary-900 leading-none tracking-tight">EduSphere</h1>
                    <span className="text-xs font-semibold text-primary-600 tracking-wide uppercase mt-1 block">
                        {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'School Admin' : 'Teacher Portal'}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5 custom-scrollbar">
                <div className="px-3 mb-4 text-xs font-bold text-secondary-400 uppercase tracking-wider">
                    Main Menu
                </div>
                {filteredItems.map((item, index) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                "animate-slide-in",
                                active
                                    ? "bg-primary-50 text-primary-700 font-semibold shadow-sm ring-1 ring-primary-100"
                                    : "text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 font-medium"
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-600 rounded-r-full shadow-glow" />
                            )}
                            <item.icon
                                size={22}
                                className={clsx(
                                    "transition-colors duration-200",
                                    active ? "text-primary-600" : "text-secondary-400 group-hover:text-secondary-600"
                                )}
                            />
                            <span className="tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-secondary-100 bg-secondary-50/50">
                <div className="bg-white rounded-2xl p-4 mb-3 flex items-center gap-3 border border-secondary-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary-900 truncate">
                            {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-secondary-500 truncate font-medium">
                            {user?.email || 'admin@edusphere.com'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-danger-600 bg-red-50 hover:bg-red-100/80 rounded-xl transition-all duration-200 hover:shadow-sm ring-1 ring-transparent hover:ring-red-200"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
