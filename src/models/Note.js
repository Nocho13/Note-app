const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  filename: {
    type: String
  },
  path: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Note', NoteSchema);