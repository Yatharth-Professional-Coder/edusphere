import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, User, Mail, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        subjects: '',
        classes: '',
        qualification: '',
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/teachers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeachers(data);
        } catch (error) {
            toast.error('Failed to fetch teachers');
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
            // Convert comma-separated strings to arrays
            const payload = {
                ...formData,
                subjects: formData.subjects.split(',').map(s => s.trim()),
                classes: formData.classes.split(',').map(s => s.trim()),
            };

            await axios.post('/api/teachers', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Teacher created successfully!');
            setIsModalOpen(false);
            fetchTeachers();
            setFormData({
                name: '',
                email: '',
                password: '',
                subjects: '',
                classes: '',
                qualification: '',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create teacher');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus size={20} className="mr-2" />
                    Add Teacher
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                        <div key={teacher._id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                                    {teacher.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{teacher.user.name}</h3>
                                    <p className="text-gray-500 text-sm flex items-center">
                                        <Mail size={14} className="mr-1" />
                                        {teacher.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start">
                                    <BookOpen size={16} className="mr-2 mt-1 text-gray-400" />
                                    <div>
                                        <span className="font-medium text-gray-900">Subjects:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {teacher.subjects.map(sub => (
                                                <span key={sub} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-6">
                                    <span className="font-medium text-gray-900">Classes:</span> {teacher.classes.join(', ')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Teacher</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma separated)</label>
                                <input
                                    type="text"
                                    name="subjects"
                                    placeholder="Math, Science, English"
                                    value={formData.subjects}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Classes (comma separated)</label>
                                <input
                                    type="text"
                                    name="classes"
                                    placeholder="10A, 9B"
                                    value={formData.classes}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
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
                                    Add Teacher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teachers;
