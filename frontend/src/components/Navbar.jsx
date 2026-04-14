import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glassmorphism" style={{
            margin: '1rem',
            padding: '0.75rem 1.5rem',
            position: 'sticky',
            top: '1rem',
            zIndex: 100,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary)', fontFamily: 'Outfit' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                        <Briefcase size={20} />
                    </div>
                    InternSphere
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>Hello, <span style={{ color: 'var(--text)' }}>{user.name}</span></span>
                            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Login</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
