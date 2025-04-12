import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

// Función auxiliar para manejar errores de MongoDB
const handleMongoError = (res, error) => {
    console.error("Error de MongoDB:", error);
    res.status(500).json({ message: "Error de conexión a la base de datos. Usando modo sin conexión." });
};

export const register = async (req, res) => {
    const { userid, password, name, email, number_phone, role } = req.body

    
    try{
        const passwordHash = await  bcrypt.hash(password, 10)

        const newUser = new User({
            userid,
            password: passwordHash,
            name,
            email,
            number_phone,
            role
        });

        const userSaved = await newUser.save();
        const token = await createAccessToken({id: userSaved._id});

        res.cookie("token", token);
        res.json({
            id: userSaved._id,
            userid: userSaved.userid,
            name: userSaved.name,
            email: userSaved.email,
            number_phone: userSaved.number_phone,
            role: userSaved.role,
        });
    }catch(e){
        handleMongoError(res, e);
    };
};

export const login = async (req, res) => {
    const { userid, password } = req.body

    try{
        // Si estamos usando la base de datos en memoria
        let userFound;
        if (global.users) {
            userFound = await User.findOne({userid});
        } else {
            // Si estamos usando MongoDB normalmente
            userFound = await User.findOne({userid});
        }
        
        if(!userFound) return res.status(400).json({message: "Usuario no encontrado"});

        const isMatch = await bcrypt.compare(password, userFound.password);
        if(!isMatch) return res.status(400).json({message: "Contraseña incorrecta"});

        const token = await createAccessToken({id: userFound._id});

        res.cookie("token", token, {
            httpOnly: false, // Permitir acceso desde JavaScript
            secure: false, // true en producción
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });
        
        res.json({
            id: userFound._id,
            userid: userFound.userid,
            name: userFound.name,
            email: userFound.email,
            number_phone: userFound.number_phone,
            role: userFound.role,
            token: token // Incluir el token en la respuesta
        });
    }catch(e){
        handleMongoError(res, e);
    };
};

export const logout = (req, res) => {
    res.cookie("token", "",{
        expires: new Date(0),
    })
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    try {
        const userFound = await User.findById(req.user.id)
        if (!userFound) return res.status(400).json({message: "Usuario no encontrado"});

        return res.json({
            id: userFound._id,
            userid: userFound.userid,
            name: userFound.name,
            email: userFound.email,
            number_phone: userFound.number_phone,
            role: userFound.role,
        });
    } catch (e) {
        handleMongoError(res, e);
    }
}

export const verifyToken = async (req, res) => {
    try {
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
        
        if(!token) return res.status(401).json({ message: "No autorizado"});
        
        jwt.verify(token, TOKEN_SECRET, async (err, user) => {
            if(err) return res.status(401).json({ message: "Token inválido"});
            
            const userFound = await User.findById(user.id)
            if (!userFound) return res.status(400).json({message: "Usuario no encontrado"});

            return res.json({
                id: userFound._id,
                userid: userFound.userid,
                name: userFound.name,
                email: userFound.email,
                number_phone: userFound.number_phone,
                role: userFound.role,
            });
        });
    } catch (e) {
        handleMongoError(res, e);
    }
}