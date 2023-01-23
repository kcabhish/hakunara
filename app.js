const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const url = `mongodb+srv://${dbUser}:${dbPass}@cluster0.bngabhc.mongodb.net/${dbName}?retryWrites=true&w=majority`
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // this needs to be replaced after the authentication
  User.findById('63c97351af8bb766fc3fd732')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(url)
  .then(result => {
    // using mock user when server is started
    User.findOne({
      email: 'haku-cha@gmail.com'
    },(err, user) => {
      if (!user) {
        console.log("user not found");
        const newUser = new User({
          name: 'Haku',
          email: 'haku-cha@gmail.com',
          cart: {
            items: []
          }
        });
        newUser.save();
      }
    });
    // end of mock user
    console.log('localhost:3000');
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
