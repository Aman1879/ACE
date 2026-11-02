require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(mongoSanitize());

// ─── Request Logging ────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Body Parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Auth Rate Limiter ──────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Offline DB Graceful Interceptor ─────────────────────────────────────────
const offlineFallback = require('./middleware/offlineFallback');
app.use('/api', offlineFallback);

// ─── Routes ─────────────────────────────────────────────────────────────────
const authRoutes          = require('./routes/authRoutes');
const profileRoutes       = require('./routes/profileRoutes');
const projectRoutes       = require('./routes/projectRoutes');
const certificateRoutes   = require('./routes/certificateRoutes');
const achievementRoutes   = require('./routes/achievementRoutes');
const skillRoutes         = require('./routes/skillRoutes');
const codingRoutes        = require('./routes/codingRoutes');
const goalRoutes          = require('./routes/goalRoutes');
const internshipRoutes    = require('./routes/internshipRoutes');
const placementRoutes     = require('./routes/placementRoutes');
const noteRoutes          = require('./routes/noteRoutes');
const resumeRoutes        = require('./routes/resumeRoutes');
const streakRoutes        = require('./routes/streakRoutes');
const gamificationRoutes  = require('./routes/gamificationRoutes');
const storeRoutes         = require('./routes/storeRoutes');
const leaderboardRoutes   = require('./routes/leaderboardRoutes');
const notificationRoutes  = require('./routes/notificationRoutes');
const adminRoutes         = require('./routes/adminRoutes');
const publicRoutes        = require('./routes/publicRoutes');

app.use('/api/auth',          authLimiter, authRoutes);
app.use('/api/profile',       profileRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/certificates',  certificateRoutes);
app.use('/api/achievements',  achievementRoutes);
app.use('/api/skills',        skillRoutes);
app.use('/api/coding',        codingRoutes);
app.use('/api/goals',         goalRoutes);
app.use('/api/internships',   internshipRoutes);
app.use('/api/placements',    placementRoutes);
app.use('/api/notes',         noteRoutes);
app.use('/api/resume',        resumeRoutes);
app.use('/api/streak',        streakRoutes);
app.use('/api/gamification',  gamificationRoutes);
app.use('/api/store',         storeRoutes);
app.use('/api/leaderboard',   leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/public',        publicRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
