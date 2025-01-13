require('dotenv').config();
const secret = process.env.JWT_TOKEN;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const withAuth = (req, res, next) => {
  const token = req.headers['x-access-token'];
  //!!!!!!
  console.log('Token: ' + token);
  //!!!!!!
  
  if (!token) {
    res.status(401).json({ e: 'No token provided' });
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(401).json({ e: 'Failed to authenticate token' });
      } else {
        req.email = decoded.email;
        //!!!!!!!
        console.log('Usuario: ' + User);
        console.log('Email: ' + decoded.email);
        console.log('req.email: ' + req.email);
        //!!!!!!!
        User.findOne({ email: decoded.email })
          .then((user) => {
            //!!!!!!
            console.log('User Completo: ' + user);
            //!!!!!!
            req.user = user;
            //!!!!!!
            console.log('User: ' + req.user);
            console.log('Email: ' + decoded.email);
            //!!!!!!
            next();
          })
          .catch((err) => {
            res.status(401).json({ e: 'Failed to authenticate token' });
          });
      }
    });
  }
};

module.exports = withAuth;
