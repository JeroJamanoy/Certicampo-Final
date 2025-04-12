import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/profile.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

// Obtener perfil del usuario
router.get('/profile', getProfile);

// Actualizar información del perfil
router.put('/profile', updateProfile);

// Actualizar contraseña
router.put('/password', updatePassword);

export default router; 