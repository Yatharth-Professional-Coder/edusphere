import { School, AlertTriangle } from 'lucide-react';

const SuperAdminDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-6">Super Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                        <School size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">Total Schools</p>
                        <p className="text-2xl font-bold text-secondary-900">--</p>
                    </div>
                </div>

                <div className="card flex items-center p-6">
                    <div className="p-3 rounded-full bg-warning-100 text-warning-600 mr-4">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-secondary-500 font-medium">Reported Issues</p>
                        <p className="text-2xl font-bold text-secondary-900">--</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-heading font-semibold text-secondary-900 mb-4">Recent Reports</h2>
                <div className="card p-0 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-secondary-50 text-secondary-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-3">School</th>
                                <th className="px-6 py-3">Issue</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            <tr>
                                <td className="px-6 py-4 text-sm text-secondary-500" colSpan="4">No recent reports found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
