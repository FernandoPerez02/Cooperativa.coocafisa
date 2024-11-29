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

module.exports = router;