import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para requests
instance.interceptors.request.use(
    (config) => {
        console.log('Enviando petición a:', config.url);
        console.log('Método:', config.method);
        console.log('Datos:', config.data);
        return config;
    },
    (error) => {
        console.error('Error en la petición:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses
instance.interceptors.response.use(
    (response) => {
        console.log('Respuesta recibida:', response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('Error de respuesta:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config.url
            });
        } else if (error.request) {
            console.error('Error de red - No se recibió respuesta:', {
                url: error.config.url,
                method: error.config.method
            });
        } else {
            console.error('Error en la configuración:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;