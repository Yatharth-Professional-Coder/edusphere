import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, School, GraduationCap, ClipboardList, Banknote, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { pathname } = location;
    const { user } = useAuth();

    const trigger = null;
    const sidebar = null;

    // Define menu items based on roles (simplified for now)
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['superadmin', 'admin', 'teacher', 'student', 'parent'] },
        { name: 'Schools', path: '/schools', icon: School, roles: ['superadmin'] },
        { name: 'Teachers', path: '/teachers', icon: Users, roles: ['admin'] },
        { name: 'Students', path: '/students', icon: GraduationCap, roles: ['admin', 'teacher'] },
        { name: 'Attendance', path: '/attendance', icon: ClipboardList, roles: ['admin', 'teacher', 'parent'] },
        { name: 'Fees', path: '/fees', icon: Banknote, roles: ['admin', 'parent'] },
    ];

    return (
        <div
            className={clsx(
                'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 bg-slate-950">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    EduSphere
                </span>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Menu Items */}
            <nav className="mt-5 px-2">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        /* Logic to hide based on role would go here */
                        true && (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={clsx(
                                        'flex items-center px-4 py-3 rounded-lg transition-colors group',
                                        pathname === item.path
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    <item.icon size={20} className={clsx('mr-3', pathname === item.path ? 'text-white' : 'text-gray-500 group-hover:text-white')} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        )
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
