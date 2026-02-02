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
        <div className="h-screen w-64 bg-white border-r border-secondary-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 transition-all duration-300">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 border-b border-secondary-100">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                    <Building2 size={20} className="stroke-[2.5]" />
                </div>
                <div>
                    <h1 className="font-heading font-bold text-xl text-secondary-900 leading-none">EduSphere</h1>
                    <span className="text-xs font-medium text-secondary-400 tracking-wide uppercase">
                        {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'School Admin' : 'Teacher Portal'}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                <div className="px-3 mb-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
                    Menu
                </div>
                {filteredItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                active
                                    ? "bg-primary-50 text-primary-700 font-semibold shadow-sm"
                                    : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 font-medium"
                            )}
                        >
                            {active && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                            )}
                            <item.icon
                                size={20}
                                className={clsx(
                                    "transition-colors duration-200",
                                    active ? "text-primary-600" : "text-secondary-400 group-hover:text-secondary-600"
                                )}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-secondary-100">
                <div className="bg-secondary-50 rounded-xl p-3 mb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary-900 truncate">
                            {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-secondary-500 truncate">
                            {user?.email || 'admin@edusphere.com'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-danger-600 bg-red-50 hover:bg-red-100/80 rounded-lg transition-colors duration-200"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
