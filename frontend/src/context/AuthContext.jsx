import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                const userInfo = localStorage.getItem('userInfo');

                if (token && userInfo) {
                    // Start with cached data
                    setUser(JSON.parse(userInfo));

                    // Optional: Verify with backend
                    // const { data } = await axios.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
                    // setUser(data);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            console.error("Login failed", error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
