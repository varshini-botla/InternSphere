import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await authAPI.login({ email, password });
            login(data.user);
            navigate(`/${data.user.role}-dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glassmorphism animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
                {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glassmorphism"
                            style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glassmorphism"
                            style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <LogIn size={20} /> Login
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
