function formatDate(dateString) {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}


const isAuthenticated = (req, res, next) => {
    if (req.session.name) {
        return next();
    } else {
        res.redirect('/users/login?error=notAuthenticated');
    }
};

module.exports = { formatDate, isAuthenticated };
