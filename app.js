const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// the parameter passed in this is the session method created from express-session
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const url = `mongodb+srv://${dbUser}:${dbPass}@cluster0.bngabhc.mongodb.net/${dbName}`

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: url,
  // collection will give name for the table
  collection: 'sessions',
  // we can pass the expiry time here and monodb can clean up the data in the server directly using that options
  connectionOptions: {useUnifiedTopology: true}
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// check docs for options to be passes for session storage
app.use(session({
  secret: 'my secret', 
  resave: false, 
  saveUninitialized: false,
  store: store
}));

app.use((req, res, next) => {
  // finding the user by user id stored in the session
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
