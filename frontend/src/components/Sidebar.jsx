import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Briefcase,
    User,
    LayoutDashboard,
    ClipboardList,
    Building,
    ShieldCheck,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const navItems = {
        seeker: [
            { icon: <LayoutDashboard size={20} />, label: 'Browse Jobs', path: '/seeker-dashboard' },
            { icon: <ClipboardList size={20} />, label: 'My Applications', path: '/seeker-dashboard?view=applications' },
            { icon: <User size={20} />, label: 'Profile', path: '/seeker-dashboard?view=profile' },
        ],
        hirer: [
            { icon: <LayoutDashboard size={20} />, label: 'My Postings', path: '/hirer-dashboard' },
            { icon: <Briefcase size={20} />, label: 'Post a Job', path: '/hirer-dashboard?view=post' },
            { icon: <User size={20} />, label: 'Company Profile', path: '/hirer-dashboard?view=profile' },
        ],
        admin: [
            { icon: <ShieldCheck size={20} />, label: 'Verifications', path: '/admin-dashboard' },
            { icon: <User size={20} />, label: 'User Directory', path: '/admin-dashboard?view=users' },
        ]
    };

    const items = navItems[user.role] || [];

    return (
        <div style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            background: 'white',
            borderRight: '1px solid var(--border)',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0.5rem' }}>
                <div style={{
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '10px',
                    display: 'flex'
                }}>
                    <Briefcase size={24} />
                </div>
                <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a' }}>InternSphere</h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {items.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                            fontWeight: isActive ? '600' : '500',
                            transition: 'all 0.2s'
                        })}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>LOGGED IN AS</p>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>{user.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</p>
                </div>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--danger)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fff1f2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
