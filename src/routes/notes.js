const express = require('express');
const router = express.Router();

// Models
const Note = require('../models/Note');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/notes/add', isAuthenticated , (req, res) => {
    res.render('notes/new-note');
  });

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!description) {
    errors.push({text: 'Please Write a Description'});
  }
  if(!req.file){
    errors.push({text: 'Please Update a Image'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      title,
      description
    });
  } else {
    const newNote = new Note({title, description});
    newNote.user = req.user.id;
    newNote.filename = req.file.filename;
    newNote.path = '/img/uploads/'+ req.file.filename;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/notes');
  }
  
});
// Get All Notes
router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
  res.render('notes/all-notes', { notes });
});

// Edit Notes
router.get('/notes/edit/:id', isAuthenticated,  async (req, res) => {
  const note = await Note.findById(req.params.id);
  if(note.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/notes');
  } 
  res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id',  isAuthenticated, async (req, res) => {
  const { title, description} = req.body;

  if(req.file){
    console.log('definido');
    filename = req.file.filename;
    path = '/img/uploads/'+ filename;
  }else{
    console.log('no definido');
    filename = req.body.filename;
    path = '/img/uploads/'+ filename;
  }
  await Note.findByIdAndUpdate(req.params.id, {title, description, filename, path});
  req.flash('success_msg', 'Note Updated Successfully');
  res.redirect('/notes');
});

// Delete Notes
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Note Deleted Successfully');
  res.redirect('/notes');
});

module.exports = router;