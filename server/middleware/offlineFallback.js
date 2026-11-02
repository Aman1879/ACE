// server/middleware/offlineFallback.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { defaultAmanUser, defaultProfile, defaultCodingStats } = require('../utils/mockData');

// In-memory memory store for offline operation
const localUsers = new Map();
localUsers.set(defaultAmanUser.email.toLowerCase(), { ...defaultAmanUser, password: 'Password123!' });

// Prepopulate demo token
const generateLocalToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'ace_secret_dev_key',
    { expiresIn: '7d' }
  );
};

const offlineFallback = (req, res, next) => {
  // If MongoDB is connected (readyState === 1), proceed to real controllers
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  const path = req.path;
  const method = req.method;

  // 1. Auth Register Fallback
  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password, college, degree, graduationYear } = req.body;
    const cleanEmail = (email || 'student@iitd.ac.in').toLowerCase();

    const newUser = {
      _id: 'user_' + Date.now(),
      name: name || 'Aman Kumar',
      email: cleanEmail,
      username: (name || 'student').toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000),
      role: 'student',
      xp: 100, // Genesis Kit
      level: 1,
      levelName: 'Explorer',
      tokenBalance: 50, // Genesis Kit
      profileCompleted: false,
      profileCompletionPercent: 40,
      college: college || 'Indian Institute of Technology (IIT) Delhi',
      degree: degree || 'B.Tech',
      graduationYear: graduationYear || 2026,
      streak: 1,
      password: password || 'Password123!',
      isActive: true,
    };

    localUsers.set(cleanEmail, newUser);
    const token = generateLocalToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully (Local Storage Mode)',
      token,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        xp: newUser.xp,
        level: newUser.level,
        levelName: newUser.levelName,
        tokenBalance: newUser.tokenBalance,
        profileCompleted: newUser.profileCompleted,
        profileCompletionPercent: newUser.profileCompletionPercent,
      },
    });
  }

  // 2. Auth Login Fallback
  if (path === '/auth/login' && method === 'POST') {
    const { email } = req.body;
    const cleanEmail = (email || '').toLowerCase();
    let user = localUsers.get(cleanEmail);

    if (!user) {
      // Auto-fallback to default user for seamless experience
      user = { ...defaultAmanUser, email: cleanEmail || defaultAmanUser.email };
      localUsers.set(cleanEmail || defaultAmanUser.email, user);
    }

    const token = generateLocalToken(user);
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        xp: user.xp,
        level: user.level,
        levelName: user.levelName,
        tokenBalance: user.tokenBalance,
        profileCompleted: user.profileCompleted,
        profileCompletionPercent: user.profileCompletionPercent,
      },
    });
  }

  // 3. Auth Current User (/auth/me)
  if (path === '/auth/me' && method === 'GET') {
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'ace_secret_dev_key');
        let user = defaultAmanUser;
        if (decoded.email && localUsers.has(decoded.email.toLowerCase())) {
          user = localUsers.get(decoded.email.toLowerCase());
        }
        return res.status(200).json({
          success: true,
          data: user,
        });
      } catch {
        // Fallback to default
        return res.status(200).json({ success: true, data: defaultAmanUser });
      }
    }
    return res.status(200).json({ success: true, data: defaultAmanUser });
  }

  // 4. Profile ME Fallback
  if (path === '/profile' && method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        user: defaultAmanUser,
        profile: defaultProfile,
      },
    });
  }

  // 5. Coding Tracker Fallback
  if (path.startsWith('/coding') && method === 'GET') {
    return res.status(200).json({
      success: true,
      data: defaultCodingStats,
    });
  }

  // Allow next handlers or fallback for others
  next();
};

module.exports = offlineFallback;

