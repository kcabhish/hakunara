const User = require('../models/user');
exports.getLogin = (req, res, next) => {
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: req.session.isLoggedIn
        });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    User.findById('63c97351af8bb766fc3fd732')
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      // make sures session is created before redirecting to other pages
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      })
    })
    .catch(err => {
      console.log('check hardcoded id');
      console.log(err)
    });
    
}


exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({email: email}).then(
    userDoc => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      const user = new User({
        email: email,
        password: password,
        cart: {items: []}
      });
      return user.save();
    }
  ).then(
    result => {
      res.redirect('/login');
    }
  ).catch(err => {
    console.log(err);
  })
}

exports.postLogout = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  })
}