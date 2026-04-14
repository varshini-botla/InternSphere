const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.applyToJob = (req, res) => {
    const { jobId, seekerId, seekerName, seekerEmail, resumeUrl } = req.body;

    const existing = db.get('applications').find({ jobId, seekerId }).value();
    if (existing) return res.status(400).json({ message: "Already applied" });

    const newApp = {
        id: uuidv4(),
        jobId,
        seekerId,
        seekerName,
        seekerEmail,
        resumeUrl: resumeUrl || null,
        status: 'pending',
        appliedAt: new Date(),
        updatedAt: new Date()
    };

    db.get('applications').push(newApp).write();
    res.status(201).json(newApp);
};

exports.getJobApplicants = (req, res) => {
    const { jobId } = req.params;
    const apps = db.get('applications').filter({ jobId }).value();

    // Join with seeker profile
    const result = apps.map(app => {
        const seeker = db.get('users').find({ id: app.seekerId }).value();
        return {
            ...app,
            seekerEmail: seeker?.email,
            profile: seeker?.profile || {}
        };
    });

    res.json(result);
};

exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status, interviewDetails } = req.body;

    db.get('applications')
        .find({ id })
        .assign({
            status,
            interviewDetails: interviewDetails || null,
            updatedAt: new Date()
        })
        .write();

    res.json({ message: "Application status updated successfully" });
};

exports.getSeekerApplications = (req, res) => {
    const { seekerId } = req.params;
    const apps = db.get('applications').filter({ seekerId }).value();

    // Join with job details
    const result = apps.map(app => {
        const job = db.get('jobs').find({ id: app.jobId }).value();
        return { ...app, jobTitle: job?.title, companyName: job?.companyName };
    });

    res.json(result);
};
