const express = require('express');
const { redis } = require('googleapis/build/src/apis/redis');
const router = express.Router();

router.get('/session', (req, res) => {
  if (req.user && req.user.name) {
    return res.json({ 
      isAuthenticated: true,
      user: req.user.name,
      role: req.user.role,
      expiration: req.user.exp
    });
  } else {
    return res.json({ isAuthenticated: false, user: null });
  }
});


router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Sesión cerrada correctamente.', redirect: '/' });
});

module.exports = router;