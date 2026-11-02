const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    title: {
      type:     String,
      required: [true, 'Project title is required'],
      trim:     true,
    },
    description:  { type: String },
    category: {
      type: String,
      enum: ['Web', 'Mobile', 'AI/ML', 'Data Science', 'Blockchain', 'IoT', 'Game', 'Desktop', 'API', 'Full Stack', 'Backend', 'Systems', 'Other'],
      default: 'Web',
    },
    technologies: { type: [String], default: [] },
    image:        { type: String },
    githubUrl:    { type: String, trim: true },
    liveUrl:      { type: String, trim: true },
    startDate:    { type: Date },
    endDate:      { type: Date },
    status: {
      type:    String,
      enum:    ['In Progress', 'Completed', 'On Hold', 'Planned', 'in progress', 'completed', 'on hold', 'planned'],
      default: 'In Progress',
    },
    isPublic:    { type: Boolean, default: true },
    features:    { type: [String], default: [] },
    teamMembers: { type: [String], default: [] },
    myRole:      { type: String },
    isFeatured:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ user: 1 });
projectSchema.index({ user: 1, isPublic: 1 });

module.exports = mongoose.model('Project', projectSchema);
