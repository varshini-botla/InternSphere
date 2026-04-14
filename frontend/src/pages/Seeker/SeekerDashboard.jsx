import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobAPI, applicationAPI, adminAPI, authAPI, fileAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { Search, MapPin, Building, Clock, ChevronRight, RotateCcw, User, Link as LinkIcon, FileText, Briefcase, ClipboardList, Sparkles } from 'lucide-react';

const SeekerDashboard = () => {
    const { user, login } = useAuth();
    const toast = useToast();
    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Switch view based on query param ?view=...
    const query = new URLSearchParams(location.search);
    const view = query.get('view') || 'jobs';

    const [profileData, setProfileData] = useState(user.profile || { bio: '', skills: '', education: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingJobId, setUploadingJobId] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [jobsRes, appsRes, userRes] = await Promise.all([
                jobAPI.getAll(),
                applicationAPI.getForSeeker(user.id),
                adminAPI.getUsers()
            ]);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);

            const currentUser = userRes.data.find(u => u.id === user.id);
            if (currentUser?.profile) setProfileData(currentUser.profile);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.id]);

    const handleApply = async (jobId) => {
        if (!selectedFile) {
            toast('Please select your resume first', 'info');
            return;
        }

        setUploadingJobId(jobId);
        try {
            const uploadRes = await fileAPI.upload(selectedFile);
            const resumeUrl = uploadRes.data.url;

            await applicationAPI.apply({
                jobId,
                seekerId: user.id,
                seekerName: user.name,
                seekerEmail: user.email,
                resumeUrl
            });

            toast('Applied successfully! 🎉', 'success');
            setSelectedFile(null);
            fetchData();
        } catch (err) {
            toast(err.response?.data?.message || 'Failed to apply', 'error');
        } finally {
            setUploadingJobId(null);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await authAPI.updateProfile({ id: user.id, profile: profileData });
            login({ ...user, profile: profileData });
            toast('Profile updated successfully!', 'success');
        } catch (err) {
            toast('Update failed. Please try again.', 'error');
        }
    };

    return (
        <div className="animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>
                        {view === 'jobs' ? 'Browse Opportunities' :
                            view === 'applications' ? 'My Applications' : 'Professional Profile'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        {view === 'jobs' ? 'Discover your next career-defining internship' :
                            view === 'applications' ? 'Track and manage your sent applications' : 'Keep your details up to date for hirers'}
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

            {view === 'jobs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glassmorphism" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1.25rem', maxWidth: '600px' }}>
                        <Search size={20} color="var(--text-muted)" />
                        <input
                            placeholder="Search by title, company, or skills..."
                            style={{ background: 'transparent', border: 'none', padding: '12px', width: '100%', outline: 'none' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
                        {jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.companyName.toLowerCase().includes(search.toLowerCase())).map(job => (
                            <div key={job.id} className="glassmorphism card-hover" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                                        <Briefcase size={24} />
                                    </div>
                                    <span className="badge badge-info">{job.type}</span>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{job.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Building size={16} /> {job.companyName}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {job.location}</span>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>{job.description}</p>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: 'auto' }}>
                                    {!applications.some(a => a.jobId === job.id) ? (
                                        <>
                                            <div style={{ marginBottom: '1.25rem' }}>
                                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', display: 'block', marginBottom: '0.6rem' }}>
                                                    Upload Resume (PDF)
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                                        style={{ padding: '8px', fontSize: '0.8rem' }}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                disabled={uploadingJobId === job.id}
                                                onClick={() => handleApply(job.id)}
                                                className="btn-primary"
                                                style={{ width: '100%' }}
                                            >
                                                {uploadingJobId === job.id ? 'Submitting...' : 'Apply Now'}
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{
                                            background: '#f0f9ff',
                                            color: '#0369a1',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            fontWeight: '600'
                                        }}>
                                            Application Sent
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'applications' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {applications.length === 0 && (
                        <div className="glassmorphism" style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center' }}>
                            <ClipboardList size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                            <h3>No applications yet</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Start applying for jobs to see them here.</p>
                        </div>
                    )}
                    {applications.map(app => (
                        <div key={app.id} className="glassmorphism card-hover" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                    <FileText size={20} color="var(--primary)" />
                                </div>
                                <span className={`badge badge-${app.status === 'hired' ? 'success' : app.status === 'rejected' ? 'danger' : 'pending'}`}>
                                    {app.status}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{app.jobTitle || 'Job Application'}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{app.companyName}</p>

                            {app.interviewDetails ? (
                                <div style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Interview Scheduled</p>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text)' }}>
                                        {new Date(app.interviewDetails.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                    <a href={app.interviewDetails.link} target="_blank" rel="noreferrer" className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}>
                                        <LinkIcon size={14} /> Join Call
                                    </a>
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    Waiting for hirer review...
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {view === 'profile' && (
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem', alignItems: 'start' }}>
                    <div className="glassmorphism" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ width: '100px', height: '100px', background: 'var(--primary)', color: 'white', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <User size={48} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user.email}</p>
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'left', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Account Status</p>
                            <span className="badge badge-success">Active Seeker</span>
                        </div>
                    </div>

                    <div className="glassmorphism" style={{ padding: '2.5rem' }}>
                        <h3 style={{ marginBottom: '2rem' }}>Update Profile Details</h3>
                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.9rem' }}>Professional Bio</label>
                                <textarea
                                    style={{ minHeight: '120px', resize: 'vertical' }}
                                    placeholder="Tell us about your background, interests, and career goals..."
                                    value={profileData.bio}
                                    onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.9rem' }}>Skills (Comma separated)</label>
                                    <input
                                        placeholder="e.g. React, Python, UI Design"
                                        value={profileData.skills}
                                        onChange={e => setProfileData({ ...profileData, skills: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.9rem' }}>Education</label>
                                    <input
                                        placeholder="e.g. BS Computer Science"
                                        value={profileData.education}
                                        onChange={e => setProfileData({ ...profileData, education: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn-primary" style={{ padding: '12px 30px' }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>

                        <div className="glassmorphism" style={{ padding: '2.5rem', marginTop: '2.5rem', background: 'var(--surface)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                                <Sparkles size={20} color="var(--primary)" /> Smart AI Auto-Apply
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                Never miss an opportunity! If you are inactive for more than 3 days, our AI Agent will automatically apply to new internships that perfectly match your skills and interests using your saved resume.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--text)' }}>Enable Background Auto-Apply</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Requires a saved resume to function.</p>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: '54px', height: '30px' }}>
                                    <input
                                        type="checkbox"
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                        checked={profileData.autoApplyEnabled || false}
                                        onChange={e => {
                                            const newVal = e.target.checked;
                                            setProfileData({ ...profileData, autoApplyEnabled: newVal });
                                            // Auto-save the toggle
                                            authAPI.updateProfile({ id: user.id, profile: { ...profileData, autoApplyEnabled: newVal } })
                                                .then(() => {
                                                    login({ ...user, profile: { ...profileData, autoApplyEnabled: newVal } });
                                                    toast(newVal ? 'AI Auto-Apply activated! 🚀' : 'AI Auto-Apply disabled', 'success');
                                                });
                                        }}
                                    />
                                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: profileData.autoApplyEnabled ? 'var(--primary)' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                                        <span style={{ position: 'absolute', content: '""', height: '22px', width: '22px', left: profileData.autoApplyEnabled ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeekerDashboard;
