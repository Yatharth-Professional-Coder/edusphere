import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from '../components/dashboard/SuperAdminDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-10 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="animate-fade-in">
            {user.role === 'superadmin' && <SuperAdminDashboard />}
            {user.role === 'admin' && <AdminDashboard />}
            {user.role === 'teacher' && <TeacherDashboard />}

            {/* Fallback for other roles (Student/Parent) - To be implemented */}
            {['student', 'parent'].includes(user.role) && (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-secondary-900">Welcome to Student Portal</h2>
                    <p className="text-secondary-500 mt-2">Your dashboard is coming soon!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
