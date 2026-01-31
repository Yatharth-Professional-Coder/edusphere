import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-2">Welcome Back, {user?.name}!</h2>
                <p className="text-gray-600">
                    You are logged in as <span className="font-bold text-blue-600 capitalize">{user?.role}</span>.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {['Total Students', 'Total Teachers', 'Attendance Rate', 'Fees Collected'].map((stat) => (
                    <div key={stat} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm font-medium">{stat}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">--</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
