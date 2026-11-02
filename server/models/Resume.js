const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },
    personalInfo: {
      name:      { type: String },
      email:     { type: String },
      phone:     { type: String },
      location:  { type: String },
      linkedin:  { type: String },
      github:    { type: String },
      portfolio: { type: String },
    },
    objective:  { type: String },
    education: [
      {
        institution: { type: String },
        degree:      { type: String },
        branch:      { type: String },
        startYear:   { type: Number },
        endYear:     { type: Number },
        cgpa:        { type: String },
        percentage:  { type: String },
      },
    ],
    skills: {
      technical: { type: [String], default: [] },
      soft:      { type: [String], default: [] },
    },
    projects: [
      {
        title:        { type: String },
        description:  { type: String },
        technologies: { type: [String], default: [] },
        link:         { type: String },
      },
    ],
    experience: [
      {
        company:     { type: String },
        role:        { type: String },
        duration:    { type: String },
        description: { type: [String], default: [] },
      },
    ],
    certifications: [
      {
        name:   { type: String },
        issuer: { type: String },
        year:   { type: Number },
      },
    ],
    achievements: { type: [String], default: [] },
    positions: [
      {
        role:         { type: String },
        organization: { type: String },
        duration:     { type: String },
      },
    ],
    activeTemplate: { type: String, default: 'classic' },
    lastGenerated:  { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
