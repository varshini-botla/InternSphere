import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useToast } from '../../components/Toast';
import { ShieldCheck, UserCheck, XCircle, RotateCcw, ExternalLink, Users as UsersIcon, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const location = useLocation();
    const toast = useToast();
    const query = new URLSearchParams(location.search);
    const view = query.get('view') || 'companies';

    const [pending, setPending] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pendRes, userRes] = await Promise.all([
                adminAPI.getPending(),
                adminAPI.getUsers()
            ]);
            setPending(pendRes.data);
            setAllUsers(userRes.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (id, action) => {
        try {
            await adminAPI.verify(id, action);
            toast(`Company ${action === 'approve' ? 'approved ✅' : 'rejected ❌'} successfully.`, action === 'approve' ? 'success' : 'info');
            fetchData();
        } catch (err) {
            toast('Action failed. Please try again.', 'error');
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>
                        {view === 'companies' ? 'Company Verifications' : 'User Management'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        {view === 'companies' ? 'Review and approve company identities' : 'Oversee all registered platform users'}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="glassmorphism card-hover"
                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: '600' }}
                    disabled={isLoading}
                >
                    <RotateCcw size={18} className={isLoading ? 'animate-spin' : ''} />
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </header>

            {view === 'companies' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                    {pending.length === 0 && (
                        <div className="glassmorphism" style={{ gridColumn: '1/-1', padding: '6rem 2rem', textAlign: 'center' }}>
                            <CheckCircle2 size={64} color="var(--success)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                            <h2>All Caught Up!</h2>
                            <p style={{ color: 'var(--text-muted)' }}>There are no pending company verifications at this time.</p>
                        </div>
                    )}
                    {pending.map(comp => (
                        <div key={comp.id} className="glassmorphism card-hover" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '14px' }}>
                                    <Building2 size={24} />
                                </div>
                                <span className="badge badge-pending">Verification Required</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{comp.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{comp.email}</p>

                            {comp.profile?.proofUrl && (
                                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <AlertCircle size={16} color="var(--primary)" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Evidence Provided</span>
                                    </div>
                                    <a
                                        href={comp.profile.proofUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-primary"
                                        style={{ width: '100%', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '10px' }}
                                    >
                                        <ExternalLink size={16} /> Technical Proof Document
                                    </a>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => handleVerify(comp.id, 'approve')} className="btn-primary" style={{ background: 'var(--success)', flex: 1 }}>Approve Access</button>
                                <button onClick={() => handleVerify(comp.id, 'reject')} className="btn-primary" style={{ background: 'var(--danger)', flex: 1 }}>Deny</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'users' && (
                <div className="glassmorphism" style={{ padding: '2rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '10px', borderRadius: '10px' }}>
                            <UsersIcon size={20} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>User Directory</h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '1rem' }}>NAME</th>
                                    <th style={{ padding: '1rem' }}>EMAIL ADDRESS</th>
                                    <th style={{ padding: '1rem' }}>PLATFORM ROLE</th>
                                    <th style={{ padding: '1rem' }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(u => (
                                    <tr key={u.id} className="card-hover" style={{ background: '#f8fafc', borderRadius: '12px' }}>
                                        <td style={{ padding: '1.25rem', fontWeight: '600', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>{u.name}</td>
                                        <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                        <td style={{ padding: '1.25rem' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                background: 'white',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid var(--border)',
                                                color: 'var(--primary)'
                                            }}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                                            <span className={`badge badge-${u.isVerified ? 'success' : 'pending'}`}>
                                                {u.isVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
