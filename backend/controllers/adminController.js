const db = require('../db');

exports.getPendingCompanies = (req, res) => {
    const companies = db.get('users').filter({ role: 'hirer', isVerified: false }).value();
    res.json(companies);
};

exports.verifyCompany = (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    if (action === 'approve') {
        db.get('users').find({ id }).assign({ isVerified: true }).write();
        res.json({ message: "Company approved successfully" });
    } else {
        db.get('users').remove({ id }).write();
        res.json({ message: "Company application rejected and removed" });
    }
};

exports.getAllUsers = (req, res) => {
    const users = db.get('users').value();
    res.json(users);
};
