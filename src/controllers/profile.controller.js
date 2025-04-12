import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { nombre, email, telefono, direccion } = req.body;
        
        // Verificar si el email ya está en uso por otro usuario
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (existingUser) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { nombre, email, telefono, direccion },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Obtener el usuario con la contraseña
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }

        // Encriptar y actualizar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
}; 