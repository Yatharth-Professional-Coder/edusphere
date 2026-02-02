import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Building, User, MapPin, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Schools = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        subscriptionPlan: 'free',
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/schools', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSchools(data);
        } catch (error) {
            toast.error('Failed to fetch schools');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/schools', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('School created successfully!');
            setIsModalOpen(false);
            fetchSchools(); // Refresh list
            setFormData({
                name: '',
                address: '',
                adminName: '',
                adminEmail: '',
                adminPassword: '',
                subscriptionPlan: 'free',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create school');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Schools Management</h1>
                    <p className="text-secondary-500 text-sm mt-1">Manage all registered schools and their administrators.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} className="mr-2" />
                    Add School
                </button>
            </div>

            {/* School List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schools.map((school, index) => (
                        <div
                            key={school._id}
                            className="card card-hover group animate-scale-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                    <Building size={24} />
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${school.subscriptionPlan === 'premium' ? 'bg-accent-100 text-accent-700' :
                                        school.subscriptionPlan === 'basic' ? 'bg-success-100 text-success-700' : 'bg-secondary-100 text-secondary-600'
                                    }`}>
                                    {school.subscriptionPlan}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-secondary-900 mb-2 leading-tight">{school.name}</h3>
                            <div className="flex items-start text-secondary-500 text-sm mb-5 min-h-[40px]">
                                <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{school.address || "No address provided"}</span>
                            </div>

                            <div className="pt-4 border-t border-secondary-100 bg-secondary-50/50 -mx-6 -mb-6 p-4 rounded-b-2xl group-hover:bg-primary-50/30 transition-colors">
                                <div className="flex items-center text-sm text-secondary-600 font-medium">
                                    <ShieldCheck size={16} className="mr-2 text-primary-500" />
                                    <span>Admin: <span className="text-secondary-900">{school.adminId?.name || 'N/A'}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add School Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scale-in border border-secondary-100">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                <Building size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900">Add New School</h2>
                            <p className="text-secondary-500 text-sm mt-1">Enter the details for the new school and its administrator.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">School Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="e.g. Springfield High"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="e.g. 123 Education Lane"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Admin Name</label>
                                    <input
                                        type="text"
                                        name="adminName"
                                        value={formData.adminName}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Subscription</label>
                                    <select
                                        name="subscriptionPlan"
                                        value={formData.subscriptionPlan}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    >
                                        <option value="free">Free</option>
                                        <option value="basic">Basic</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Admin Email</label>
                                    <input
                                        type="email"
                                        name="adminEmail"
                                        value={formData.adminEmail}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="admin@school.com"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Admin Password</label>
                                    <input
                                        type="password"
                                        name="adminPassword"
                                        value={formData.adminPassword}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1 shadow-lg shadow-primary-500/25"
                                >
                                    Create School
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schools;
