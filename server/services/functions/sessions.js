const express = require('express');
const router = express.Router();

router.get('/session', (req, res) => {
  if (req.session && req.session.name) {
    console.log('Datos de sesión:', req.session.name, req.session.name,
      req.session.role,
      req.session.cookie.expires,);
      return res.json({ 
        isAuthenticated: true,
        user: req.session.name,
        role: req.session.role,
        expiration: req.session.cookie.expires,
       });
  } else {
    console.log('No hay sesión iniciada.', req.session, req.session.name);
    console.log('Datos de sesión:', req.session.name,
      req.session.role,
      req.session.cookie.expires,);
    return res.json({ isAuthenticated: false, user: null });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.clearCookie('session_cookie_name');
    return res.status(200).json({ message: 'Cerrado sesión...', redirect: "/"});
  });
});

module.exports = router;