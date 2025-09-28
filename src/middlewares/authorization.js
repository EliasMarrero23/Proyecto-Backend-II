
export const authorization = (role) => {
    return (req, res, next) => {
        // El usuario debe estar autenticado
        if (!req.user || req.user.role !== role) {
            return res.status(403).send({ error: 'Forbidden: Insufficient privileges' });
        }
        next();
    };
};
export const adminAuth = authorization('admin');
export const userAuth = authorization('user');