import axios from '../api/axios';

export const cultivosService = {
    getAllCultivos: async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token recuperado:', token ? 'Presente' : 'No encontrado');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            console.log('Intentando obtener cultivos...');
            const response = await axios.get('/registros', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Respuesta exitosa:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            
            return response.data;
        } catch (error) {
            console.error('Error detallado en getAllCultivos:', {
                message: error.message,
                response: {
                    data: error.response?.data,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    headers: error.response?.headers
                },
                request: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers,
                    baseURL: error.config?.baseURL
                }
            });
            throw new Error(`Error al obtener cultivos: ${error.response?.data?.message || error.message}`);
        }
    },

    getCultivoById: async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.get(`/registros/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener cultivo:', error.response?.data || error.message);
            throw error;
        }
    },

    createCultivo: async (cultivoData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.post('/registros', cultivoData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear cultivo:', error.response?.data || error.message);
            throw error;
        }
    },

    updateCultivo: async (id, cultivoData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.put(`/registros/${id}`, cultivoData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar cultivo:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteCultivo: async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await axios.delete(`/registros/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al eliminar cultivo:', error.response?.data || error.message);
            throw error;
        }
    }
}; 