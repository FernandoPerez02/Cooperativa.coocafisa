const express = require('express');
const router = express.Router();

router.get('/session', (req, res) => {
  if (req.user && req.user.name) {
    return res.json({ 
      isAuthenticated: true,
      user: req.user.name,
      role: req.user.role,
      expiration: req.user.exp,
      Data: req.user,
    });
  } else {
    return res.json({ isAuthenticated: false, user: null });
  }
});

module.exports = router;