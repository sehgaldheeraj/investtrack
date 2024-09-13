const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
   // Extract the Authorization header
   const authHeader = req.header('Authorization');
   
   // Check if the header exists and has the Bearer token format
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Access Denied');
   }
   
   // Extract the token from the header
   const token = authHeader.split(' ')[1];
   
   try {
      // Verify the token
      
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
   } catch (err) {
      res.status(401).send('Invalid Token');
   }
};

module.exports = authenticate;
