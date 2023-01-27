const User = require('../models/user');
exports.getLogin = (req, res, next) => {
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: req.session.isLoggedIn
        });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    User.findById('63c97351af8bb766fc3fd732')
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.redirect('/');
    })
    .catch(err => {
      console.log('check hardcoded id');
      console.log(err)
    });
    
}

exports.postLogout = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  })
}