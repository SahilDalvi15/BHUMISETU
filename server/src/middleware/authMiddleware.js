const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // DEMO MODE: Inject a default admin user for SIH prototype demo
    req.user = {
      id: 'demo_admin_001',
      username: 'admin',
      name: 'National Admin',
      role: 'National Admin',
      stateId: null,
      districtId: null
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bhumisetu_demo_secret');
    req.user = decoded;
    next();
  } catch (error) {
    // Token invalid — fallback to demo user for prototype
    req.user = {
      id: 'demo_admin_001',
      username: 'admin',
      name: 'National Admin',
      role: 'National Admin',
      stateId: null,
      districtId: null
    };
    next();
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
