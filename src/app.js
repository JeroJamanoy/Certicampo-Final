import express from 'express';
import morgan from 'morgan';
import cookieParse from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import registroRuotes from './routes/RegistrosCultivos.routes.js';
import postsRoutes from './routes/posts.routes.js';
import profileRoutes from './routes/profile.routes.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://certi-campo.vercel.app',
    'http://localhost:3000'
];

// Middleware para logging de rutas (debe ir antes de las rutas)
app.use((req, res, next) => {
    console.log('Nueva petición:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

app.use(cors({
    origin: function(origin, callback) {
        console.log('Origen de la petición:', origin);
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'La política CORS para este sitio no permite el acceso desde el origen especificado.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParse());

// Ruta de health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/registros", registroRuotes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", profileRoutes);

// Ruta de prueba para verificar que la API está funcionando
app.get('/api/test', (req, res) => {
    res.json({ message: 'API está funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    console.log('Ruta no encontrada:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    res.status(404).json({ 
        error: 'Not Found',
        message: `La ruta ${req.method} ${req.path} no existe`
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
});

export default app;