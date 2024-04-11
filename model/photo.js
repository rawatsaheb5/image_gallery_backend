// model/photo.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  published: {
    type: Date,
    default: Date.now // Default value for published is the current date and time
  }

  
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
