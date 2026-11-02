const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },
    avatar:         { type: String },
    bio:            { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    phone:          { type: String, trim: true },
    college:        { type: String, trim: true },
    degree:         { type: String, trim: true },
    branch:         { type: String, trim: true },
    graduationYear: { type: Number },
    skills:         { type: [String], default: [] },
    careerInterests:{ type: [String], default: [] },
    github:         { type: String, trim: true },
    linkedin:       { type: String, trim: true },
    portfolio:      { type: String, trim: true },
    twitter:        { type: String, trim: true },
    timezone:       { type: String, default: 'Asia/Kolkata' },
    isPublic:       { type: Boolean, default: true },
    location:       { type: String, trim: true },

    // Section visibility controls
    showProjects:     { type: Boolean, default: true },
    showCertificates: { type: Boolean, default: true },
    showAchievements: { type: Boolean, default: true },
    showCoding:       { type: Boolean, default: true },
    showInternships:  { type: Boolean, default: true },
    showResume:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
