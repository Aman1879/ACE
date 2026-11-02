require('dotenv').config();
const mongoose    = require('mongoose');
const bcrypt      = require('bcryptjs');
const connectDB   = require('../config/db');

const User          = require('../models/User');
const Profile       = require('../models/Profile');
const Streak        = require('../models/Streak');
const RewardRule    = require('../models/RewardRule');
const Badge         = require('../models/Badge');
const StoreProduct  = require('../models/StoreProduct');

// ─── Default Reward Rules ────────────────────────────────────────────────────
const defaultRewardRules = [
  { activityType: 'welcome',             description: 'Welcome bonus for joining ACE',          xpAmount: 50,  tokenAmount: 20 },
  { activityType: 'add_project',         description: 'Added a new project',                    xpAmount: 30,  tokenAmount: 10 },
  { activityType: 'add_certificate',     description: 'Added a new certificate',                xpAmount: 25,  tokenAmount: 8  },
  { activityType: 'add_achievement',     description: 'Added a new achievement',                xpAmount: 20,  tokenAmount: 5  },
  { activityType: 'add_coding_profile',  description: 'Linked a coding platform profile',       xpAmount: 15,  tokenAmount: 5  },
  { activityType: 'complete_goal',       description: 'Completed a goal',                       xpAmount: 40,  tokenAmount: 15 },
  { activityType: 'complete_profile',    description: 'Completed your profile (first time)',    xpAmount: 100, tokenAmount: 50 },
  { activityType: 'add_internship',      description: 'Added an internship experience',         xpAmount: 20,  tokenAmount: 5  },
  { activityType: 'daily_streak',        description: 'Daily activity streak bonus',            xpAmount: 10,  tokenAmount: 2  },
  { activityType: 'streak_7',            description: '7-day streak milestone',                 xpAmount: 50,  tokenAmount: 20 },
  { activityType: 'streak_30',           description: '30-day streak milestone',                xpAmount: 200, tokenAmount: 80 },
  { activityType: 'update_resume',       description: 'Updated resume',                        xpAmount: 10,  tokenAmount: 3  },
  { activityType: 'badge_unlock',        description: 'Badge unlocked',                        xpAmount: 0,   tokenAmount: 0  },
];

// ─── Default Badges ──────────────────────────────────────────────────────────
const defaultBadges = [
  {
    slug: 'first-step',   name: 'First Step',    description: 'Welcome to ACE Genesis Kit!',
    icon: '👣', category: 'special',  condition: { type: 'xp_threshold', value: 1 },
    rarity: 'Common', tokenReward: 5, xpReward: 10,
  },
  {
    slug: 'coding-pioneer', name: 'Coding Pioneer', description: 'Connected official LeetCode or GitHub account',
    icon: '💻', category: 'special', condition: { type: 'coding_profile_count', value: 1 },
    rarity: 'Common', tokenReward: 15, xpReward: 30,
  },
  {
    slug: 'algorithm-ace', name: 'Algorithm Ace', description: 'Solved 25+ verified coding problems',
    icon: '⚡', category: 'special', condition: { type: 'coding_solves', value: 25 },
    rarity: 'Rare', tokenReward: 30, xpReward: 60,
  },
  {
    slug: 'project-starter', name: 'Project Starter', description: 'Added your first project',
    icon: '🚀', category: 'projects', condition: { type: 'project_count', value: 1 },
    rarity: 'Common', tokenReward: 10, xpReward: 20,
  },
  {
    slug: 'project-builder', name: 'Project Builder', description: 'Added 5 projects',
    icon: '🏗️', category: 'projects', condition: { type: 'project_count', value: 5 },
    rarity: 'Rare', tokenReward: 25, xpReward: 50,
  },
  {
    slug: 'certified', name: 'Certified', description: 'Earned your first certificate',
    icon: '📜', category: 'certificates', condition: { type: 'certificate_count', value: 1 },
    rarity: 'Common', tokenReward: 10, xpReward: 20,
  },
  {
    slug: '3-day-streak', name: '3-Day Streak', description: 'Maintained a 3-day streak',
    icon: '🔥', category: 'streak', condition: { type: 'streak_days', value: 3 },
    rarity: 'Common', tokenReward: 5, xpReward: 15,
  },
  {
    slug: '7-day-champion', name: '7-Day Champion', description: 'Maintained a 7-day streak',
    icon: '⚡', category: 'streak', condition: { type: 'streak_days', value: 7 },
    rarity: 'Rare', tokenReward: 20, xpReward: 50,
  },
  {
    slug: '30-day-champion', name: '30-Day Champion', description: 'Maintained a 30-day streak',
    icon: '🏆', category: 'streak', condition: { type: 'streak_days', value: 30 },
    rarity: 'Epic', tokenReward: 80, xpReward: 200,
  },
  {
    slug: '100-day-legend', name: '100-Day Legend', description: 'Maintained a 100-day streak',
    icon: '👑', category: 'streak', condition: { type: 'streak_days', value: 100 },
    rarity: 'Legendary', tokenReward: 300, xpReward: 500,
  },
  {
    slug: 'goal-getter', name: 'Goal Getter', description: 'Completed your first goal',
    icon: '✅', category: 'goals', condition: { type: 'goal_count', value: 1 },
    rarity: 'Common', tokenReward: 10, xpReward: 20,
  },
  {
    slug: 'level-5', name: 'Explorer', description: 'Reached Level 5',
    icon: '🌟', category: 'platform', condition: { type: 'level_reached', value: 5 },
    rarity: 'Rare', tokenReward: 30, xpReward: 0,
  },
];

// ─── Default Store Products ──────────────────────────────────────────────────
const defaultProducts = [
  {
    name:        'ACE Pro Badge',
    description: 'Exclusive Pro badge displayed on your public profile',
    category:    'Badge',
    tokenPrice:  200,
    stock:       -1,
    details:     'Lifetime badge displayed next to your name on public profiles and leaderboard.',
    tags:        ['badge', 'profile', 'exclusive'],
    isFeatured:  true,
  },
  {
    name:        'Dark Theme',
    description: 'Unlock the sleek dark theme for ACE dashboard',
    category:    'Theme',
    tokenPrice:  150,
    stock:       -1,
    details:     'A beautiful dark mode theme for your ACE dashboard.',
    tags:        ['theme', 'ui', 'dark'],
    isFeatured:  false,
  },
  {
    name:        'ACE Sticker Pack',
    description: 'Set of 10 exclusive ACE stickers shipped to your address',
    category:    'Physical',
    tokenPrice:  500,
    stock:       100,
    details:     'High quality vinyl stickers. Requires valid delivery address.',
    tags:        ['stickers', 'physical', 'merch'],
    isFeatured:  true,
  },
  {
    name:        'Resume Premium Template',
    description: 'Access to 5 premium resume templates',
    category:    'Premium',
    tokenPrice:  300,
    stock:       -1,
    details:     'Unlock 5 professionally designed resume templates for download.',
    tags:        ['resume', 'templates', 'premium'],
    isFeatured:  false,
  },
];

// ─── Main Seed ───────────────────────────────────────────────────────────────
const seedInitialData = async () => {
  console.log('\n🌱 Initializing ACE MongoDB collections...');

  // 1. Reward Rules
  for (const rule of defaultRewardRules) {
    await RewardRule.findOneAndUpdate(
      { activityType: rule.activityType },
      rule,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // 2. Badges
  for (const badge of defaultBadges) {
    await Badge.findOneAndUpdate(
      { slug: badge.slug },
      badge,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // 3. Demo Admin User
  const existingAdmin = await User.findOne({ email: 'admin@ace.dev' });
  if (!existingAdmin) {
    const admin = await User.create({
      name:     'ACE Admin',
      email:    'admin@ace.dev',
      password: 'Admin@123',
      role:     'admin',
      username: 'ace-admin',
    });
    await Profile.create({ user: admin._id });
    await Streak.create({ user: admin._id });
    console.log('   ✅ Admin user ready: admin@ace.dev / Admin@123');
  }

  // 4. Demo Student Showcase User (Aman Kumar)
  const existingStudent = await User.findOne({ email: 'aman.kumar@iitd.ac.in' });
  if (!existingStudent) {
    const student = await User.create({
      name:         'Aman Kumar',
      email:        'aman.kumar@iitd.ac.in',
      password:     'Password123!',
      role:         'student',
      username:     'aman-kumar',
      xp:           4820,
      level:        14,
      levelName:    'Pro Learner',
      tokenBalance: 1450,
      totalTokensEarned: 2400,
      profileCompleted: true,
      profileCompletionPercent: 85,
    });
    await Profile.create({
      user:           student._id,
      headline:       'IIT Delhi • CS \'26 | Distributed Systems & High-Throughput Microservices',
      bio:            'Building high-performance distributed systems, low-latency key-value stores, and algorithmic infrastructure.',
      college:        'Indian Institute of Technology (IIT) Delhi',
      degree:         'Bachelor of Technology',
      branch:         'Computer Science and Engineering',
      graduationYear: 2026,
      cgpa:           9.24,
      location:       'New Delhi, India',
      phone:          '+91 98765 43210',
      github:         'https://github.com/aman-k',
      linkedin:       'https://linkedin.com/in/aman-dev',
      portfolio:      'https://ace.app/u/aman-kumar',
      careerTrack:    'Backend & Distributed Systems',
    });
    await Streak.create({
      user:          student._id,
      currentStreak: 27,
      longestStreak: 35,
      lastActivityDate: new Date(),
    });
    console.log('   ✅ Demo student ready: aman.kumar@iitd.ac.in / Password123!');
  }

  // 5. Store Products
  for (const product of defaultProducts) {
    await StoreProduct.findOneAndUpdate(
      { name: product.name },
      product,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log('🎉 ACE collections seeded successfully!\n');
};

exports.seedInitialData = seedInitialData;

// Run standalone if invoked directly
if (require.main === module) {
  connectDB()
    .then(() => seedInitialData())
    .then(() => mongoose.connection.close())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seed failed:', err);
      process.exit(1);
    });
}
