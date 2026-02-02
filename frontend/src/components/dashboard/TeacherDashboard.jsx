import { BookOpen, Calendar, Clock } from 'lucide-react';

const TeacherDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-6">Teacher Portal</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">My Classes</p>
                        <p className="text-2xl font-bold text-secondary-900">--</p>
                    </div>
                </div>

                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-warning-100 text-warning-600 mr-4">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">Pending Homework</p>
                        <p className="text-2xl font-bold text-secondary-900">--</p>
                    </div>
                </div>

                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-success-100 text-success-600 mr-4">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">Today's Schedule</p>
                        <p className="text-sm font-semibold text-secondary-900">No classes today</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-heading font-semibold text-secondary-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="btn btn-primary justify-center">Take Attendance</button>
                    <button className="btn bg-white border border-secondary-200 text-secondary-700 hover:bg-secondary-50 justify-center">Assign Homework</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
