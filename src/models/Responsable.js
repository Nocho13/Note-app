const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResponsableSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    required: true
  },
  filename: {
    type: String
  },
  path: {
    type: String
  },
  user: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Responsable', ResponsableSchema);