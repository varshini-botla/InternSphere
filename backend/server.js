const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authController = require('./controllers/authController');
const jobController = require('./controllers/jobController');
const applicationController = require('./controllers/applicationController');
const adminController = require('./controllers/adminController');
const upload = require('./middleware/uploadMiddleware');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Upload Utility Route (Single file)
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url });
});

// Auth
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.put('/api/auth/profile', authController.updateProfile);

// Jobs
app.get('/api/jobs', jobController.getAllJobs);
app.get('/api/jobs/hirer/:hirerId', jobController.getJobsByHirer);
app.post('/api/jobs', jobController.createJob);

// Applications
app.post('/api/applications', applicationController.applyToJob);
app.get('/api/applications/seeker/:seekerId', applicationController.getSeekerApplications);
app.get('/api/applications/job/:jobId', applicationController.getJobApplicants);
app.patch('/api/applications/:id', applicationController.updateStatus);

// Admin
app.get('/api/admin/pending', adminController.getPendingCompanies);
app.post('/api/admin/verify/:id', adminController.verifyCompany);
app.get('/api/admin/users', adminController.getAllUsers);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
