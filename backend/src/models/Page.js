import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    default: '',
    trim: true,
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: [true, 'Workspace is required'],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null, // null means it's a top-level page
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Updated by is required'],
  },
  order: {
    type: Number,
    default: 0, // For ordering pages within the same parent
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Indexes for faster queries
pageSchema.index({ workspaceId: 1 });
pageSchema.index({ parentId: 1 });
pageSchema.index({ workspaceId: 1, parentId: 1 }); // Compound index for workspace + parent queries

// Virtual for child pages count (not populated by default)
pageSchema.virtual('childrenCount', {
  ref: 'Page',
  localField: '_id',
  foreignField: 'parentId',
  count: true,
});

// Ensure virtuals are included in JSON
pageSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Page = mongoose.model('Page', pageSchema);

export default Page;

