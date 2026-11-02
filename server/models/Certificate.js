const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    name: {
      type:     String,
      required: [true, 'Certificate name is required'],
      trim:     true,
    },
    issuingOrg: {
      type:     String,
      required: [true, 'Issuing organization is required'],
      trim:     true,
    },
    issueDate:     { type: Date },
    expiryDate:    { type: Date },
    credentialId:  { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
    fileUrl:       { type: String }, // Cloudinary URL
    category: {
      type: String,
      enum: ['Technical', 'Professional', 'Academic', 'Language', 'Other'],
    },
    description: { type: String },
    isPublic:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
