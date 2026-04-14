const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.createJob = (req, res) => {
    const { hirerId, title, description, companyName, location, type, requirements } = req.body;

    const newJob = {
        id: uuidv4(),
        hirerId,
        title,
        companyName,
        description,
        location,
        type,
        requirements: requirements || [],
        status: 'open',
        createdAt: new Date()
    };

    db.get('jobs').push(newJob).write();
    res.status(201).json(newJob);
};

exports.getAllJobs = (req, res) => {
    const jobs = db.get('jobs').filter({ status: 'open' }).value();
    res.json(jobs);
};

exports.getJobsByHirer = (req, res) => {
    const { hirerId } = req.params;
    const jobs = db.get('jobs').filter({ hirerId }).value();
    res.json(jobs);
};
