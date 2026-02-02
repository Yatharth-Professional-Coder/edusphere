import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, User, Mail, BookOpen, GraduationCap } from 'lucide-react';
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Teachers</h1>
                    <p className="text-secondary-500 text-sm mt-1">Manage teacher profiles, subjects, and class assignments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} className="mr-2" />
                    Add Teacher
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher, index) => (
                        <div
                            key={teacher._id}
                            className="card card-hover group animate-scale-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-inner border border-indigo-200">
                                    {teacher.user.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-secondary-900 truncate">{teacher.user.name}</h3>
                                    <p className="text-secondary-500 text-sm flex items-center truncate">
                                        <Mail size={14} className="mr-1.5" />
                                        {teacher.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-secondary-50 rounded-xl">
                                    <div className="flex items-center text-sm font-semibold text-secondary-900 mb-2">
                                        <BookOpen size={16} className="mr-2 text-primary-500" />
                                        Subjects
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {teacher.subjects.map(sub => (
                                            <span key={sub} className="px-2 py-0.5 bg-white border border-secondary-200 text-secondary-600 rounded-md text-xs font-medium shadow-sm">
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm px-1">
                                    <span className="text-secondary-500 flex items-center">
                                        <GraduationCap size={16} className="mr-1.5" />
                                        Classes
                                    </span>
                                    <span className="font-semibold text-secondary-900">{teacher.classes.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scale-in border border-secondary-100 overflow-y-auto max-h-[90vh]">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                <User size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900">Add New Teacher</h2>
                            <p className="text-secondary-500 text-sm mt-1">Create a new teacher profile in the system.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="teacher@school.com"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Qualification</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="e.g. M.Sc Mathematics"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Subjects</label>
                                    <input
                                        type="text"
                                        name="subjects"
                                        placeholder="Math, Science"
                                        value={formData.subjects}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        required
                                    />
                                    <p className="text-xs text-secondary-400 mt-1">Comma separated</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Classes</label>
                                    <input
                                        type="text"
                                        name="classes"
                                        placeholder="10A, 9B"
                                        value={formData.classes}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        required
                                    />
                                    <p className="text-xs text-secondary-400 mt-1">Comma separated</p>
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
