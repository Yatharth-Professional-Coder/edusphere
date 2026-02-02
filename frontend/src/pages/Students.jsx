import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, User, Mail, GraduationCap, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        className: '',
        section: '',
        rollNumber: '',
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/students', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(data);
        } catch (error) {
            toast.error('Failed to fetch students');
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
            await axios.post('/api/students', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Student created successfully!');
            setIsModalOpen(false);
            fetchStudents();
            setFormData({
                name: '',
                email: '',
                password: '',
                className: '',
                section: '',
                rollNumber: '',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create student');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 tracking-tight">Students</h1>
                    <p className="text-secondary-500 text-sm mt-1">Manage student records, performace, and enrollment.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} className="mr-2" />
                    Add Student
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student, index) => (
                        <div
                            key={student._id}
                            className="card card-hover group animate-scale-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-success-50 to-success-100 rounded-2xl flex items-center justify-center text-success-600 font-bold text-xl shadow-inner border border-success-200">
                                    {student.user.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-secondary-900 truncate">{student.user.name}</h3>
                                    <p className="text-secondary-500 text-sm flex items-center truncate">
                                        <Mail size={14} className="mr-1.5" />
                                        {student.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-center mb-2">
                                <div className="bg-secondary-50 rounded-xl p-2 border border-secondary-100">
                                    <p className="text-[10px] text-secondary-400 uppercase tracking-wider font-bold">Class</p>
                                    <p className="font-bold text-secondary-900 text-lg">{student.className}-{student.section}</p>
                                </div>
                                <div className="bg-secondary-50 rounded-xl p-2 border border-secondary-100">
                                    <p className="text-[10px] text-secondary-400 uppercase tracking-wider font-bold">Roll No</p>
                                    <p className="font-bold text-secondary-900 text-lg">#{student.rollNumber}</p>
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
                            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4 text-success-600">
                                <GraduationCap size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-secondary-900">Add New Student</h2>
                            <p className="text-secondary-500 text-sm mt-1">Enroll a new student into the class.</p>
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
                                        placeholder="e.g. Alex Smith"
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
                                        placeholder="student@school.com"
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
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Class</label>
                                    <input
                                        type="text"
                                        name="className"
                                        value={formData.className}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="10"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Section</label>
                                    <input
                                        type="text"
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="A"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-secondary-700 mb-1.5">Roll Number</label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={formData.rollNumber}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="101"
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
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
