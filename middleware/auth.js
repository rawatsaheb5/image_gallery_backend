
const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
    
    const token = req.headers.authorization;
    
    //console.log('mera token hai ',usertoken);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
