import { Link } from 'react-router-dom';
import { CheckCircle, School } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <School className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">EduSphere</span>
                    </div>
                    <div>
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors">
                            Login
                        </Link>
                        <Link to="/login" className="bg-blue-600/90 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30 ml-2">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Manage Your School <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Like a Startup
                    </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    A multi-tenant SaaS platform for modern schools. Track attendance, manage fees, and share results with parents in real-time.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/login" className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-lg">
                        Start Free Trial
                    </Link>
                    <button className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-200 transition-colors text-lg">
                        View Demo
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Multi-School', desc: 'Manage unlimited schools from a single super-admin dashboard.' },
                            { title: 'Secure & Fast', desc: 'Built with Node.js & MongoDB Atlas. Enterprise-grade security.' },
                            { title: 'Parent App', desc: 'Parents can check results, fees, and attendance on their phone.' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
