const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';
const JWT_EXPIRY = '1H';
const JWT_ALGORITHM = 'HS256';

/**
 * Takes some data and generate JWT
 *
 * @param {Object} payload data used to generate JWT
 */
const generateJwtToken = payload => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: JWT_ALGORITHM
  });
};

/**
 * Application level middleware to control authentiation
 * checks req.cookies.token and decode it, and attach
 * the result to req.quthStatus and pass it to next middleware
 *
 * @param {Request} req express req object
 * @param {Response} res express res object
 * @param { Function} next express next middleware
 */
const checkUserAuthStatus = (req, res, next) => {
  const user = decodeJwt(req.cookies.token);

  if (user) {
    req.authStatus = { user: user, loggedIn: true };
    return next();
  }
  req.authStatus = { user: null, loggedIn: false };
  next();
};

/**
 * Checks JWT and return payload,
 * payload includes the iat and exp properties
 * otherwise return false
 * @param {JWT} token a JWT token
 */
const decodeJwt = token => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return false;
  }
};

module.exports = {
  checkUserAuthStatus,
  decodeJwt,
  generateJwtToken,
  JWT_SECRET,
  JWT_ALGORITHM
};
