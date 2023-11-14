const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust the path based on your project structure
// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

  // function for our authenticated routes
  const authMiddleware = async ({ req }) => {
    // allows token to be sent via  req.query or headers
    let token = req.headers.authorization || '';

    // ["Bearer", "<tokenvalue>"]
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trim();
    }

    if (!token) {
      throw new AuthenticationError('You have no token!');
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      const user = await User.findById(data._id); // Fetch user details from the database
      return { user };
    } catch (err) {
      console.log('Invalid token');
      throw new AuthenticationError('Invalid token!'); 
    }
};

module.exports = { authMiddleware };
