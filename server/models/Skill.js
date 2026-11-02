const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    name: {
      type:     String,
      required: [true, 'Skill name is required'],
      trim:     true,
    },
    category: {
      type: String,
      enum: ['Programming Language', 'Frontend', 'Backend', 'Database', 'Tool', 'Framework', 'Soft Skill', 'Other'],
    },
    proficiency: {
      type:    String,
      enum:    ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    relatedProject: { type: String },
    learningStatus: {
      type:    String,
      enum:    ['Learning', 'Practicing', 'Confident', 'Expert'],
      default: 'Learning',
    },
    icon: { type: String },
  },
  { timestamps: true }
);

skillSchema.index({ user: 1 });

module.exports = mongoose.model('Skill', skillSchema);
