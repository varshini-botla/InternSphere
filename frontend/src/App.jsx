import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { User, Building } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/Seeker/SeekerDashboard';
import HirerDashboard from './pages/Hirer/HirerDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};



const Layout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {user && <Sidebar />}
      <div style={{
        flex: 1,
        marginLeft: user ? 'var(--sidebar-width)' : 0,
        transition: 'margin-left 0.3s ease',
        background: 'var(--background)'
      }}>
        {!user && <Navbar />}
        <main style={{ padding: user ? '2rem' : 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/seeker-dashboard" element={
                <PrivateRoute role="seeker"><SeekerDashboard /></PrivateRoute>
              } />
              <Route path="/hirer-dashboard" element={
                <PrivateRoute role="hirer"><HirerDashboard /></PrivateRoute>
              } />
              <Route path="/admin-dashboard" element={
                <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
              } />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

const Home = () => (
  <div className="container" style={{ paddingTop: '8vh', paddingBottom: '10vh' }}>
    <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="animate-fade-in">
      <h1 style={{
        fontSize: '4.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1.5rem',
        lineHeight: '1.1',
        letterSpacing: '-0.02em'
      }}>
        InternSphere: <br /> Elevate Your Career.
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
        The most premium platform connecting ambitious students with industry-leading companies for elite internships and full-time roles.
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Job Seeker Section */}
      <div className="glassmorphism card-hover animate-fade-in" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <User size={40} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Job Seeker</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', minHeight: '60px', fontSize: '1rem' }}>
          Find your dream internship, build your professional profile, and track your applications in real-time.
        </p>
        <Link to="/register" style={{ width: '100%' }}>
          <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>I want to Find Work</button>
        </Link>
      </div>

      {/* Hirer Section */}
      <div className="glassmorphism card-hover animate-fade-in" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: '0.1s' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Building size={40} color="var(--secondary)" />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Hirer / Company</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', minHeight: '60px', fontSize: '1rem' }}>
          Post opportunities, manage applicants, and hire the best talent through our integrated hiring workflow.
        </p>
        <Link to="/register" style={{ width: '100%' }}>
          <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: 'var(--secondary)' }}>I want to Hire Talent</button>
        </Link>
      </div>
    </div>
  </div>
);



export default App;
