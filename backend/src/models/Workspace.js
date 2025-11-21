import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  }, {
    timestamps: true, // Adds createdAt and updatedAt
  });


workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ members: 1 });

// Virtual for member count
workspaceSchema.virtual('memberCount').get(function() {
  return this.members ? this.members.length : 0;
});

// Ensure virtuals are included in JSON
workspaceSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;