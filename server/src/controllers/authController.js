const jwt = require('jsonwebtoken');

// Mock user database for demo authentication
const DEMO_USERS = [
  { id: '1', username: 'admin_nat', name: 'National Administrator', role: 'National Admin' },
  { id: '2', username: 'auth_cen', name: 'Central Authority Officer', role: 'Central Authority' },
  { id: '3', username: 'off_state_mh', name: 'Maharashtra State Officer', role: 'State Officer', stateId: 'MH' },
  { id: '4', username: 'off_dist_thn', name: 'Thane District Officer', role: 'District Officer', stateId: 'MH', districtId: 'THN' },
  { id: '5', username: 'field_01', name: 'Field Verifier', role: 'Field Officer' },
];

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // For demo purposes, we ignore the password and just match the username
    const user = DEMO_USERS.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Use a demo role.' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      stateId: user.stateId,
      districtId: user.districtId
    };

    // Use a dummy secret for prototype
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'bhumisetu_demo_secret', { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: payload
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
