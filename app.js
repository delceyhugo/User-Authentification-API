var express = require('express')
var app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
// Import Routes
const userRoutes = require('./routes/user');



// Configuration header 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Connection a la DB
mongoose.connect(process.env.DB, {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


function errorHandler(err, req, res, next){
  if(err){
    res.json({err : err})
  }
}



// Middleware
app.use(bodyParser.json());
app.use('/api/user', userRoutes);
app.use(errorHandler)

app.listen(process.env.PORT)