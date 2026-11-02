const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    company: {
      type:     String,
      required: [true, 'Company name is required'],
      trim:     true,
    },
    role: {
      type:     String,
      required: [true, 'Role is required'],
      trim:     true,
    },
    type: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
    },
    location:       { type: String, trim: true },
    startDate:      { type: Date },
    endDate:        { type: Date },
    stipend:        { type: Number },
    description:    { type: String },
    skillsUsed:     { type: [String], default: [] },
    certificateUrl: { type: String },
    status: {
      type:    String,
      enum:    ['Interested', 'Applied', 'Assessment', 'Interview', 'Selected', 'Rejected', 'Completed'],
      default: 'Completed',
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

internshipSchema.index({ user: 1 });

module.exports = mongoose.model('Internship', internshipSchema);
