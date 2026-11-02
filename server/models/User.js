const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:   false,
    },
    role: {
      type:    String,
      enum:    ['student', 'admin'],
      default: 'student',
    },
    username: {
      type:   String,
      unique: true,
      trim:   true,
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    xp: {
      type:    Number,
      default: 0,
    },
    level: {
      type:    Number,
      default: 1,
    },
    levelName: {
      type:    String,
      default: 'Beginner',
    },
    tokenBalance: {
      type:    Number,
      default: 0,
    },
    totalTokensEarned: {
      type:    Number,
      default: 0,
    },
    streak: {
      type:    Number,
      default: 1,
    },
    profileCompleted: {
      type:    Boolean,
      default: false,
    },
    profileCompletionPercent: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ─── Pre-save: hash password ─────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance method: comparePassword ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance method: getSignedJWT ──────────────────────────────────────────
userSchema.methods.getSignedJWT = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);
