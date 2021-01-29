const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();
require('dotenv').config();


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = `mongodb+srv://${process.env.dbUser}:${process.env.dbPass}@cluster0.hnfsi.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
  app.listen(3000);
  console.log('db connected');
})

  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

//cookies
app.get('/set-cookies', (req, res) => {
  
  res.cookie('newUser', false);
  res.cookie('employee', true, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true },)

  res.send('you got the cookies!')

});

app.get('/read-cookies', (req, res) => {

  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies);

});