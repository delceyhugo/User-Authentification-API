const express = require('express')
const auth = require('./auth')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Schéma de données    
const User = require('../models/user')



// Crée un utilisateur
router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    if(req.body.password !== req.body.confirmPassword){
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    else if(req.body.password.length < 8){
      return res.status(400).json({ error: 'The password is too short (min 8 characters)' });
    }
    const user = new User({
        email: req.body.email,
        password: hash,
    });    
    user.save(function (error){
      if(error){
        res.status(400).json({ error: 'Account already exist' })
      }
      else{
        res.status(201).json({ message: 'Your account has been created'})
      }
    })
  })
})


// Connecter un utilisateur
router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Incorrect password' });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
              { _id: user._id },
              process.env.PRIVATE_KEY,
              { expiresIn: '24h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
})


// Afficher les utilisateurs
router.get('/getAllUsers', auth, (req, res, next) => {
  User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error }));
})


// Modifier un utilisateur
router.put('/modify/:id', auth, (req, res, next) => {
  User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'User modified'}))
    .catch(error => res.status(400).json({ error }));
})


// Supprimer un utilisateur 
router.delete('/delete/:id', auth, (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'User deleted'}))
      .catch(error => res.status(400).json({ error }));
})




router.get('/test', auth, (req, res, next) => {
  res.status(200).json({test: 'test'})
})


module.exports = router;