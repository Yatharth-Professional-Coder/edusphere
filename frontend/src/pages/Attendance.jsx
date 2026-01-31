import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock, FileText, Search, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('mark'); // 'mark' (teacher) or 'view' (student/parent)

    // Teacher State
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: 'Present' | 'Absent' ... }
    const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);

    // Student State
    const [myAttendance, setMyAttendance] = useState([]);

    useEffect(() => {
        if (user?.role === 'student') {
            setView('view');
            fetchMyAttendance();
        }
    }, [user]);

    // Fetch students when filters change (Teacher Mode)
    useEffect(() => {
        if ((user?.role === 'admin' || user?.role === 'teacher') && selectedClass && selectedSection && selectedDate) {
            checkAndFetchAttendance();
        }
    }, [selectedClass, selectedSection, selectedDate]);

    const fetchMyAttendance = async () => {
        setLoading(true);
        try {
            // Ideally we need the student ID. 
            // Assuming we have an endpoint that resolves user -> student, or we store studentId in user context
            // For now, let's assume we can fetch "my-profile" or similar.
            // But wait, the controller expects 'studentId'.
            // Let's try to fetch the student profile first.
            const token = localStorage.getItem('token');
            const studentRes = await axios.get('/api/students/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (studentRes.data) {
                const studentId = studentRes.data._id;
                const { data } = await axios.get(`/api/attendance/student/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMyAttendance(data);
            }
        } catch (error) {
            console.error(error);
            // toast.error("Failed to fetch attendance history");
        } finally {
            setLoading(false);
        }
    };

    const checkAndFetchAttendance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/attendance', {
                params: { date: selectedDate, className: selectedClass, section: selectedSection },
                headers: { Authorization: `Bearer ${token}` }
            });

            // Attendance exists
            setIsAlreadyMarked(true);
            const recordsMap = {};
            data.records.forEach(r => {
                recordsMap[r.studentId] = r.status;
            });

            // We also need the full student list to show names, not just IDs
            // If the attendance API returns populated student data, we can use that directly
            // My controller update returns populated data! :)
            setStudents(data.records.map(r => ({
                _id: r.studentId,
                name: r.name,
                rollNumber: r.rollNumber
            })));
            setAttendanceRecords(recordsMap);

        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Not marked yet, fetch all students for this class/section
                setIsAlreadyMarked(false);
                fetchStudentsForClass();
            } else {
                toast.error("Error fetching attendance data");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentsForClass = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/students', {
                params: { class: selectedClass, section: selectedSection },
                headers: { Authorization: `Bearer ${token}` }
            });
            // data might be all students, need to filter if backend doesn't filter
            // Assuming backend supports filtering or returns all. 
            // Let's rely on backend filtering if possible, else frontend.
            // The current studentController for getAll might only filter by school.
            // We might need to handle this.
            const classStudents = data.filter(s => s.class === selectedClass && s.section === selectedSection);

            setStudents(classStudents.map(s => ({
                _id: s._id,
                name: s.user.name,
                rollNumber: s.rollNumber
            })));

            // Initialize all as Present
            const initialRecords = {};
            classStudents.forEach(s => {
                initialRecords[s._id] = 'Present';
            });
            setAttendanceRecords(initialRecords);

        } catch (error) {
            toast.error("Failed to fetch students");
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const records = students.map(s => ({
                studentId: s._id,
                status: attendanceRecords[s._id]
            }));

            await axios.post('/api/attendance', {
                date: selectedDate,
                className: selectedClass,
                section: selectedSection,
                records
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Attendance marked successfully!");
            setIsAlreadyMarked(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit attendance");
        }
    };

    if (loading && !students.length) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user?.role === 'student' ? 'My Attendance' : 'Class Attendance'}
                </h1>
                <div className="text-sm text-gray-500 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {user?.role === 'student' ? (
                // STUDENT VIEW
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <h3 className="text-green-800 font-semibold mb-1">Present</h3>
                            <p className="text-3xl font-bold text-green-600">{myAttendance.filter(a => a.status === 'Present').length}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <h3 className="text-red-800 font-semibold mb-1">Absent</h3>
                            <p className="text-3xl font-bold text-red-600">{myAttendance.filter(a => a.status === 'Absent').length}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h3 className="text-blue-800 font-semibold mb-1">Attendance Rate</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {myAttendance.length > 0
                                    ? Math.round((myAttendance.filter(a => a.status === 'Present').length / myAttendance.length) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-y border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myAttendance.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                                    record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // TEACHER/ADMIN VIEW
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select Class</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={String(i + 1)}>Class {i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select Section</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedClass || !selectedSection || students.length === 0}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAlreadyMarked ? 'Update Attendance' : 'Save Attendance'}
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    {students.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.rollNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleStatusChange(student._id, 'Present')}
                                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${attendanceRecords[student._id] === 'Present'
                                                                ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(student._id, 'Absent')}
                                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${attendanceRecords[student._id] === 'Absent'
                                                                ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        Absent
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(student._id, 'Late')}
                                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${attendanceRecords[student._id] === 'Late'
                                                                ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500'
                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        Late
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <Search size={48} strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No students selected</h3>
                            <p className="mt-1 text-gray-500">Select a Class and Section to view or mark attendance.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Attendance;
