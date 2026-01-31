import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, DollarSign, Calendar, CheckCircle, XCircle, CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Payment Modal State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);

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

    const openPaymentModal = (fee) => {
        setSelectedFee(fee);
        setIsPaymentModalOpen(true);
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);

        // Simulate network delay
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                await axios.post(`/api/fees/${selectedFee._id}/pay-online`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Payment Successful!');
                setIsPaymentModalOpen(false);
                fetchFees();
            } catch (error) {
                toast.error('Payment failed. Please try again.');
            } finally {
                setProcessingPayment(false);
            }
        }, 1500);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fee Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and track fee payments</p>
                </div>
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={20} className="mr-2" />
                        Create Fee Record
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader className="animate-spin text-blue-500" size={32} />
                </div>
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
                                    <th className="px-6 py-4">Action</th>
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
                                        <td className="px-6 py-4 font-bold text-gray-900">
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
                                        <td className="px-6 py-4">
                                            {user?.role === 'admin' ? (
                                                fee.status !== 'Paid' && (
                                                    <button
                                                        onClick={() => markAsPaid(fee._id)}
                                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )
                                            ) : (
                                                fee.status !== 'Paid' && (
                                                    <button
                                                        onClick={() => openPaymentModal(fee)}
                                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                                    >
                                                        Pay Now
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {fees.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <div className="bg-gray-100 p-3 rounded-full mb-3">
                                                    <DollarSign size={24} className="text-gray-400" />
                                                </div>
                                                <p>No fee records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Admin Add Fee Modal */}
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

            {/* Mock Payment Modal */}
            {isPaymentModalOpen && selectedFee && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                            <h2 className="text-2xl font-bold mb-1">Secure Payment</h2>
                            <p className="text-blue-100 text-sm">Complete your transaction securely</p>
                        </div>

                        <div className="p-6">
                            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-xl font-bold text-gray-900">${selectedFee.amount.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">{selectedFee.type}</p>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="0000 0000 0000 0000"
                                            defaultValue="4242 4242 4242 4242"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="MM/YY"
                                            defaultValue="12/26"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVC</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="123"
                                            defaultValue="123"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processingPayment}
                                    className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex justify-center items-center mt-4 shadow-lg hover:shadow-xl transform active:scale-95 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processingPayment ? (
                                        <>
                                            <Loader className="animate-spin mr-2" size={18} />
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay $${selectedFee.amount.toFixed(2)}`
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors text-sm"
                                >
                                    Cancel Transaction
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fees;
