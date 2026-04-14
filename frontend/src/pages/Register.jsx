import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, fileAPI } from '../services/api';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'seeker' });
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setError('');

        try {
            let proofUrl = '';
            if (formData.role === 'hirer') {
                if (!file) {
                    setError('Please upload company verification proof');
                    setIsUploading(false);
                    return;
                }
                const uploadRes = await fileAPI.upload(file);
                proofUrl = uploadRes.data.url;
            }

            await authAPI.register({
                ...formData,
                profile: formData.role === 'hirer' ? { proofUrl } : {}
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glassmorphism animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ textAlign: 'center' }}>Create Account</h2>
                {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Full Name</label>
                        <input
                            type="text" required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="glassmorphism" style={{ padding: '10px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Email Address</label>
                        <input
                            type="email" required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="glassmorphism" style={{ padding: '10px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>Password</label>
                        <input
                            type="password" required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="glassmorphism" style={{ padding: '10px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label>I am a:</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="glassmorphism" style={{ padding: '10px', background: 'var(--surface)' }}
                        >
                            <option value="seeker">Job Seeker</option>
                            <option value="hirer">Hirer (Company)</option>
                        </select>
                    </div>

                    {formData.role === 'hirer' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label>Company Verification Proof (PDF/Image)</label>
                            <input
                                type="file"
                                required
                                accept=".pdf,image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="glassmorphism" style={{ padding: '10px' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Upload business license or identity proof for verification.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Registering...' : <><UserPlus size={20} /> Register</>}
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
