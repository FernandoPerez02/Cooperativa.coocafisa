function formatDate(dateString) {
    if (!dateString || isNaN(new Date(dateString))) {
        return "Sin fecha";
    }

    const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}


const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.name) {
        return res.status(404).json({ errors: "No estás autenticado.", redirect: "/" });
    }
        return next();
    }

const roleMiddleware = (role) => (req, res, next) => {
    if (!req.session || !req.session.role) {
        return res.status(404).json({ errors: "No tienes permisos para acceder a esta ruta.", redirect: "/" });
    } else if (req.session.role !== role) {
        return res.status(403).json({ errors: "No tienes el rol adecuado para acceder a esta ruta." });
    }
    next();
};
    

module.exports = { formatDate, isAuthenticated, roleMiddleware };
