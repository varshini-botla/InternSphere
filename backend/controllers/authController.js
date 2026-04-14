const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.register = (req, res) => {
    const { name, email, password, role, profile } = req.body;
    const existingUser = db.get('users').find({ email }).value();
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        role,
        isVerified: role === 'hirer' ? false : true,
        profile: profile || {}
    };

    db.get('users').push(newUser).write();
    res.status(201).json({ message: "Registration successful", user: { id: newUser.id, role: newUser.role } });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = db.get('users').find({ email }).value();

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role === 'hirer' && !user.isVerified) {
        // return res.status(403).json({ message: "Account pending admin verification" });
        // For now, let them login but show a warning on frontend
    }

    res.json({
        message: "Login successful",
        user: { id: user.id, role: user.role, name: user.name, isVerified: user.isVerified }
    });
};

exports.updateProfile = (req, res) => {
    const { id, profile } = req.body;

    const user = db.get('users').find({ id }).value();
    if (!user) return res.status(404).json({ message: "User not found" });

    db.get('users')
        .find({ id })
        .assign({ profile: { ...user.profile, ...profile } })
        .write();

    res.json({ message: "Profile updated successfully", profile });
};
