const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema(
  {
    status: { type: String },
    date:   { type: Date },
    notes:  { type: String },
  },
  { _id: false }
);

const placementApplicationSchema = new mongoose.Schema(
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
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
    },
    location:     { type: String, trim: true },
    appliedDate:  { type: Date },
    jobUrl:       { type: String, trim: true },
    package:      { type: String },
    status: {
      type:    String,
      enum:    ['Saved', 'Applied', 'Online Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected', 'Offer Received'],
      default: 'Applied',
    },
    interviewDate: { type: Date },
    notes:         { type: String },
    timeline:      { type: [timelineEntrySchema], default: [] },
  },
  { timestamps: true }
);

placementApplicationSchema.index({ user: 1 });

module.exports = mongoose.model('PlacementApplication', placementApplicationSchema);
