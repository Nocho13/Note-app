const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/node-notes-db', {
  useCreateIndex: true,
  useNewUrlParser: true
})
  .then(db => console.log('DB is connected fuck you'))
  .catch(err => console.error(err));