import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Building, User } from 'lucide-react';
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
    const { user } = useAuth(); // Could be used for permission check if not handled by route

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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus size={20} className="mr-2" />
                    Add School
                </button>
            </div>

            {/* Stats or Search could go here */}

            {/* School List */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schools.map((school) => (
                        <div key={school._id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    <Building size={24} />
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${school.subscriptionPlan === 'premium' ? 'bg-purple-100 text-purple-700' :
                                        school.subscriptionPlan === 'basic' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {school.subscriptionPlan.toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{school.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{school.address || "No address provided"}</p>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <User size={16} className="mr-2" />
                                    <span>Admin: {school.adminId?.name || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add School Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New School</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                                <input
                                    type="text"
                                    name="adminName"
                                    value={formData.adminName}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                                <input
                                    type="email"
                                    name="adminEmail"
                                    value={formData.adminEmail}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                                <input
                                    type="password"
                                    name="adminPassword"
                                    value={formData.adminPassword}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
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

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
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
