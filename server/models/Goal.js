const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    title: {
      type:     String,
      required: [true, 'Goal title is required'],
      trim:     true,
    },
    description: { type: String },
    category: {
      type: String,
      enum: ['Coding', 'Projects', 'Certificates', 'Skills', 'Career', 'Health', 'Learning', 'DSA', 'Other'],
      default: 'Coding',
    },
    priority: {
      type:    String,
      enum:    ['Low', 'Medium', 'High', 'low', 'medium', 'high'],
      default: 'Medium',
    },
    dueDate: { type: Date },
    status: {
      type:    String,
      enum:    ['Pending', 'In Progress', 'Completed', 'pending', 'in progress', 'completed'],
      default: 'Pending',
    },
    progress: {
      type:    Number,
      default: 0,
      min:     0,
      max:     100,
    },
    type: {
      type:    String,
      enum:    ['Daily', 'Weekly', 'Monthly', 'Long-term', 'daily', 'weekly', 'monthly', 'long-term'],
      default: 'Weekly',
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1 });
goalSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Goal', goalSchema);
