const mongoose = require('mongoose');

const HomeSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
  },
  backgroundImage: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('HomeSection', HomeSectionSchema);
