import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    // Intentar obtener el token de las cookies
    const cookieToken = req.cookies.token;
    
    // Intentar obtener el token del encabezado Authorization
    const authHeader = req.headers.authorization;
    let headerToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        headerToken = authHeader.substring(7);
    }
    
    // Usar cualquiera de los dos tokens
    const token = cookieToken || headerToken;
    
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" });

        req.user = user;
        next();
    });
};
