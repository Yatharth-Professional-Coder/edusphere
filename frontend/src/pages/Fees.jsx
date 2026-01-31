import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        type: 'Tuition',
        dueDate: '',
    });

    useEffect(() => {
        fetchFees();
        if (user?.role === 'admin') {
            fetchStudents();
        }
    }, [user]);

    const fetchFees = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/fees', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFees(data);
        } catch (error) {
            toast.error('Failed to fetch fees');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/students', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students for fee dropdown");
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/fees', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Fee record created successfully!');
            setIsModalOpen(false);
            fetchFees();
            setFormData({
                studentId: '',
                amount: '',
                type: 'Tuition',
                dueDate: '',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create fee record');
        }
    };

    const markAsPaid = async (id) => {
        if (!confirm('Are you sure you want to mark this fee as PAID?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/fees/${id}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Fee marked as paid');
            fetchFees();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center"
                    >
                        <Plus size={20} className="mr-2" />
                        Create Fee Record
                    </button>
                )}
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    {user?.role === 'admin' && <th className="px-6 py-4">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {fees.map((fee) => (
                                    <tr key={fee._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {fee.student?.user?.name || 'Unknown'}
                                            <div className="text-xs text-gray-500 font-normal">{fee.student?.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{fee.type}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ${fee.amount}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-2 text-gray-400" />
                                                {new Date(fee.dueDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fee.status === 'Paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : new Date(fee.dueDate) < new Date() && fee.status === 'Pending'
                                                        ? 'bg-red-100 text-red-800' // Overdue
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {fee.status === 'Paid' ? <CheckCircle size={12} className="mr-1" /> : null}
                                                {fee.status}
                                            </span>
                                        </td>
                                        {user?.role === 'admin' && (
                                            <td className="px-6 py-4">
                                                {fee.status !== 'Paid' && (
                                                    <button
                                                        onClick={() => markAsPaid(fee._id)}
                                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {fees.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No fee records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Add Fee Record</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                                <select
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">-- Select Student --</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.user?.name} ({s.rollNumber})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="Tuition">Tuition Fee</option>
                                    <option value="Exam">Exam Fee</option>
                                    <option value="Transport">Transport Fee</option>
                                    <option value="Library">Library Fee</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="0.00"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary mt-2"
                            >
                                Create Record
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fees;
