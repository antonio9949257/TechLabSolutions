const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    name: {
      // Denormalized for easy display, store user's name at time of comment
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // The admin who created the project
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL to the image
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    stars: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
