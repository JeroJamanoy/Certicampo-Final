import axios from '../api/axios';

export const foroService = {
    getAllPosts: async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token ? 'Presente' : 'No encontrado');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            console.log('Obteniendo posts...');
            const response = await axios.get('/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Respuesta de posts:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener posts:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.post('/posts', postData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear post:', error);
            throw error;
        }
    },

    likePost: async (postId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.post(`/posts/${postId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al dar like:', error);
            throw error;
        }
    },

    addComment: async (postId, comment) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.post(`/posts/${postId}/comments`, { content: comment }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al comentar:', error);
            throw error;
        }
    }
}; 