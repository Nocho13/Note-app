const express = require('express');
const router = express.Router();

// Models
const Responsable = require('../models/Responsable');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/responsable/add', isAuthenticated , (req, res) => {
    res.render('responsable/new-responsable');
  });

router.post('/responsable/new-responsable', isAuthenticated, async (req, res) => {
  const { nombre, numero } = req.body;
  const errors = [];
  if (!nombre) {
    errors.push({text: 'Please Write a Name.'});
  }
  if (!numero) {
    errors.push({text: 'Please Write a Number'});
  }
  if(!req.file){
    errors.push({text: 'Please Update a Image'});
  }
  if (errors.length > 0) {
    res.render('responsable/new-responsable', {
      errors,
      nombre,
      numero
    });
  } else {
    const newNote = new Responsable({nombre, numero});
    newNote.user = req.user.id;
    newNote.filename = req.file.filename;
    newNote.path = '/img/uploads/'+ req.file.filename;
    await newNote.save();
    req.flash('success_msg', 'Responsable Added Successfully');
    res.redirect('/responsable');
  }
  
});
// Get All Notes
router.get('/responsable', isAuthenticated, async (req, res) => {
  const responsable = await Responsable.find({user: req.user.id}).sort({date: 'desc'});
  res.render('responsable/all-responsable', { responsable });
});

// Edit Notes
router.get('/responsable/edit/:id', isAuthenticated,  async (req, res) => {
  const responsable = await Responsable.findById(req.params.id);
  if(responsable.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/responsable');
  } 
  res.render('responsable/edit-responsable', { responsable });
});

router.put('/responsable/edit-responsable/:id',  isAuthenticated, async (req, res) => {
  const { nombre, numero } = req.body;
  if(req.file){
    console.log('definido');
    filename = req.file.filename;
    path = '/img/uploads/'+ filename;
  }else{
    console.log('no definido');
    filename = req.body.filename;
    path = '/img/uploads/'+ filename;
  }
  await Responsable.findByIdAndUpdate(req.params.id, {nombre, numero, filename, path});
  req.flash('success_msg', 'Responsable Updated Successfully');
  res.redirect('/responsable');
});

// Delete Notes
router.delete('/responsable/delete/:id', isAuthenticated, async (req, res) => {
  await Responsable.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Responsable Deleted Successfully');
  res.redirect('/responsable');
});

module.exports = router;