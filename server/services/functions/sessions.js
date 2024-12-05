const express = require('express');
const router = express.Router();

router.get('/sessionExpiration', (req, res) => {
    if (req.session && req.session.cookie.expires) {
      const expirationDate = new Date(req.session.cookie.expires);
      const currentTime = new Date();
      const timeLeft = expirationDate - currentTime;
      if (timeLeft <= 0) {
        return res.status(401).json({ error: 'Sesión expirada' });
      }
      const minutesRemaining = Math.floor(timeLeft / 1000 / 60);
      const secondsRemaining = Math.floor(timeLeft / 1000) % 60;

      return res.status(200).json({
        expiration: expirationDate.toISOString(),
        timeRemaining: { minute: minutesRemaining, seconds: secondsRemaining },
      });
      } else {
        return res.status(401).json({ error: 'Sesión no válida o expirada' });
      }
});

router.get('/session', (req, res) => {
  if (req.session && req.session.name) {
      return res.json({ isAuthenticated: true, user: req.session.name, role: req.session.role });
  } else {
      return res.json({ isAuthenticated: false, user: null });
  }
});

router.get('/logout', (req, res) => {
  const userName = req.session ? req.session.name : 'Desconocido';
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.clearCookie('session_cookie_name');
    return res.status(200).json({ message: 'Cerrado sesión...', redirect: "/"});
  });
});

module.exports = router;