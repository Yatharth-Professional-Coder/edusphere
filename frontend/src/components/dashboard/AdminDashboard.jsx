import { Users, GraduationCap, Building2 } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-6">School Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-info-100 text-info-600 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">Total Teachers</p>
                        <p className="text-2xl font-bold text-secondary-900">--</p>
                    </div>
                </div>

                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-success-100 text-success-600 mr-4">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-secondary-900">--</p>
                    </div>
                </div>

                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-accent-100 text-accent-600 mr-4">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">Active Classes</p>
                        <p className="text-2xl font-bold text-secondary-900">--</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card h-64 flex flex-col justify-center items-center text-secondary-400">
                    <p>Attendance Chart Placeholder</p>
                </div>
                <div className="card h-64 flex flex-col justify-center items-center text-secondary-400">
                    <p>Fee Collection Chart Placeholder</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
