import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { jobAPI, applicationAPI, adminAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { PlusCircle, Users, Check, X, Calendar, Link as LinkIcon, FileText, Building as BuildingIcon, MapPin, Search, RotateCcw, Clock, Briefcase } from 'lucide-react';

const HirerDashboard = () => {
    const { user, login } = useAuth();
    const toast = useToast();
    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [isVerified, setIsVerified] = useState(user.isVerified);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const query = new URLSearchParams(location.search);
    const view = query.get('view') || 'postings';
    const activeJobId = query.get('jobId');

    const [newJob, setNewJob] = useState({ title: '', description: '', location: '', type: 'Internship', requirements: '' });
    const [profileData, setProfileData] = useState(user.profile || { companyName: '', bio: '' });
    const [interviewModal, setInterviewModal] = useState({ isOpen: false, appId: null, date: '', link: '' });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: users } = await adminAPI.getUsers();
            const currentUser = users.find(u => u.id === user.id);
            if (currentUser) {
                setIsVerified(currentUser.isVerified);
                if (currentUser.isVerified !== user.isVerified) {
                    login({ ...user, isVerified: currentUser.isVerified });
                }
                if (currentUser.profile) setProfileData(currentUser.profile);
            }

            const { data: jobsRes } = await jobAPI.getByHirer(user.id);
            setJobs(jobsRes);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.id]);

    useEffect(() => {
        if (activeJobId && jobs.length > 0) {
            fetchApplicants(activeJobId);
        }
    }, [activeJobId, jobs]);

    const fetchApplicants = async (jobId) => {
        const { data } = await applicationAPI.getForJob(jobId);
        setApplicants(data);
        setSelectedJob(jobs.find(j => j.id === jobId));
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        await jobAPI.create({ ...newJob, hirerId: user.id, companyName: user.name });
        toast('Job posted successfully! 🚀', 'success');
        setNewJob({ title: '', description: '', location: '', type: 'Internship', requirements: '' });
        fetchData();
    };

    const handleUpdateStatus = async (appId, status, details = null) => {
        await applicationAPI.updateStatus(appId, { status, interviewDetails: details });
        fetchApplicants(selectedJob ? selectedJob.id : activeJobId);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        await authAPI.updateProfile({ id: user.id, profile: profileData });
        login({ ...user, profile: profileData });
        toast('Company profile updated!', 'success');
    };

    return (
        <div className="animate-fade-in">
            {!isVerified && (
                <div style={{
                    background: '#fff7ed',
                    border: '1px solid #fdba74',
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: '#9a3412'
                }}>
                    <X size={20} />
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
                        Your account is pending verification. Seekers cannot see your jobs until an admin approves your profile.
                    </p>
                </div>
            )}

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>
                        {view === 'postings' ? 'Active Postings' :
                            view === 'post' ? 'Create New Job' : 'Company Profile'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        {view === 'postings' ? 'Manage your job listings and review applicants' :
                            view === 'post' ? 'Reach the best talent by posting your opportunity' : 'Manage your company details and verification'}
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

            {view === 'postings' && (
                <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '350px 1fr' : '1fr', gap: '2rem' }}>
                    {/* Job Select Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {jobs.map(job => (
                            <div
                                key={job.id}
                                onClick={() => fetchApplicants(job.id)}
                                className={`glassmorphism card-hover ${selectedJob?.id === job.id ? 'active' : ''}`}
                                style={{
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    borderLeft: selectedJob?.id === job.id ? '4px solid var(--primary)' : '1px solid var(--border)',
                                    background: selectedJob?.id === job.id ? 'rgba(59, 130, 246, 0.03)' : 'white'
                                }}
                            >
                                <h4 style={{ margin: '0 0 0.5rem 0', color: selectedJob?.id === job.id ? 'var(--primary)' : 'var(--text)' }}>{job.title}</h4>
                                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={12} /> {job.type}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={12} /> {job.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Applicants View */}
                    <div>
                        {selectedJob ? (
                            <div className="animate-fade-in">
                                <div className="glassmorphism" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#f8fafc' }}>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedJob.title}</h2>
                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Reviewing {applicants.length} candidates</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {applicants.length === 0 && (
                                        <div className="glassmorphism" style={{ padding: '4rem', textAlign: 'center' }}>
                                            <Search size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                                            <h3>No applicants yet</h3>
                                            <p style={{ color: 'var(--text-muted)' }}>This job hasn't received any applications yet.</p>
                                        </div>
                                    )}
                                    {applicants.map(app => (
                                        <div key={app.id} className="glassmorphism card-hover" style={{ padding: '2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {app.seekerName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{app.seekerName}</h3>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{app.seekerEmail}</p>
                                                    </div>
                                                </div>
                                                <span className={`badge badge-${app.status === 'hired' ? 'success' : app.status === 'rejected' ? 'danger' : 'pending'}`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                                                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text)' }}>
                                                    <strong>Candidate Bio:</strong> {app.profile?.bio || 'No bio provided.'}
                                                </p>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                                                    <span><strong>Skills:</strong> {app.profile?.skills || 'N/A'}</span>
                                                    <span><strong>Education:</strong> {app.profile?.education || 'N/A'}</span>
                                                </div>
                                                {app.resumeUrl && (
                                                    <a
                                                        href={app.resumeUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn-primary"
                                                        style={{ marginTop: '1.25rem', padding: '8px 16px', fontSize: '0.85rem', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)' }}
                                                    >
                                                        <FileText size={16} /> View Candidate Resume
                                                    </a>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleUpdateStatus(app.id, 'shortlisted')} className="btn-primary" style={{ flex: 1 }}>Shortlist</button>
                                                        <button onClick={() => handleUpdateStatus(app.id, 'rejected')} className="btn-primary" style={{ flex: 1, background: 'var(--danger)' }}>Reject</button>
                                                    </>
                                                )}
                                                {app.status === 'shortlisted' && (
                                                    <button
                                                        onClick={() => setInterviewModal({ isOpen: true, appId: app.id, date: '', link: '' })}
                                                        className="btn-primary"
                                                        style={{ width: '100%', background: 'var(--secondary)' }}
                                                    >
                                                        <Calendar size={18} /> Schedule Interview
                                                    </button>
                                                )}
                                                {app.status === 'interview_scheduled' && (
                                                    <button onClick={() => handleUpdateStatus(app.id, 'hired')} className="btn-primary" style={{ width: '100%', background: 'var(--success)' }}>
                                                        <Check size={18} /> Final Hire
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="glassmorphism" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                                <Briefcase size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
                                <h2>Select a Posting</h2>
                                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                                    Choose one of your job listings from the left to manage candidates and hiring status.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {view === 'post' && (
                <div className="glassmorphism animate-fade-in" style={{ padding: '3rem', maxWidth: '800px' }}>
                    <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Job Title</label>
                            <input required placeholder="e.g. Software Engineering Intern" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Job Description</label>
                            <textarea required placeholder="Outline responsibilities and expectations..." style={{ minHeight: '150px' }} value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Location</label>
                                <input required placeholder="e.g. Remote / New York" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Job Type</label>
                                <select value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })}>
                                    <option value="Internship">Internship</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary" style={{ padding: '12px 40px' }}>Publish Posting</button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'profile' && (
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem', alignItems: 'start' }}>
                    <div className="glassmorphism" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ width: '100px', height: '100px', background: 'var(--secondary)', color: 'white', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <BuildingIcon size={48} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user.email}</p>
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', textAlign: 'left', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Verification</p>
                            <span className={`badge badge-${isVerified ? 'success' : 'danger'}`}>
                                {isVerified ? 'Verified Company' : 'Pending Proof Approval'}
                            </span>
                        </div>
                    </div>

                    <div className="glassmorphism" style={{ padding: '2.5rem' }}>
                        <h3 style={{ marginBottom: '2rem' }}>Company Details</h3>
                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Company Legal Name</label>
                                <input placeholder="e.g. Google LLC" value={profileData.companyName} onChange={e => setProfileData({ ...profileData, companyName: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Company Bio</label>
                                <textarea
                                    style={{ minHeight: '120px' }}
                                    placeholder="Write a brief overview of your company culture and mission..."
                                    value={profileData.bio}
                                    onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                                />
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="btn-primary" style={{ padding: '12px 30px', background: 'var(--secondary)' }}>
                                    Save Profile Details
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Interview Schedule Modal */}
            {interviewModal.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="glassmorphism animate-fade-in" style={{ padding: '2.5rem', width: '90%', maxWidth: '420px', background: 'var(--surface)', boxShadow: 'var(--shadow-lg)' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                            <Calendar size={24} color="var(--primary)" /> Schedule Interview
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>Interview Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={interviewModal.date}
                                    onChange={e => setInterviewModal({ ...interviewModal, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>Meeting Link</label>
                                <input
                                    type="url"
                                    placeholder="e.g. https://meet.google.com/xxx-xxxx-xxx"
                                    value={interviewModal.link}
                                    onChange={e => setInterviewModal({ ...interviewModal, link: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setInterviewModal({ isOpen: false, appId: null, date: '', link: '' })}
                                    className="btn-primary"
                                    style={{ flex: 1, background: '#e2e8f0', color: '#475569', boxShadow: 'none' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (interviewModal.date && interviewModal.link) {
                                            handleUpdateStatus(interviewModal.appId, 'interview_scheduled', {
                                                date: interviewModal.date,
                                                link: interviewModal.link
                                            });
                                            setInterviewModal({ isOpen: false, appId: null, date: '', link: '' });
                                        } else {
                                            toast('Please provide both date and meeting link', 'error');
                                        }
                                    }}
                                    className="btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HirerDashboard;
