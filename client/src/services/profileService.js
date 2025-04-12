import axios from '../api/axios';

export const profileService = {
    getProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.get('/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.put('/users/profile', userData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            throw error;
        }
    },

    updatePassword: async (passwordData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.put('/users/password', passwordData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            throw error;
        }
    }
}; 