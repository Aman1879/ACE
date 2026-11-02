const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    title: {
      type:     String,
      required: [true, 'Note title is required'],
      trim:     true,
    },
    content:  { type: String },
    category: {
      type:    String,
      enum:    ['Study', 'Career', 'Project', 'Interview', 'General', 'Other'],
      default: 'General',
    },
    tags:       { type: [String], default: [] },
    isPinned:   { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    color:      { type: String, default: '#FFFFFF' },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1 });
noteSchema.index({ user: 1, isPinned: -1 });

module.exports = mongoose.model('Note', noteSchema);
