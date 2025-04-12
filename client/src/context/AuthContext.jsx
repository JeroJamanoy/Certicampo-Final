import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, verifyToken } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe estar dentro del proveedor AuthContext");
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const login = async (userData) => {
        try {
            setErrors(null);
            console.log("Datos enviados al backend:", userData);
            const res = await loginRequest(userData);
            console.log("Respuesta del backend:", res.data);
            
            // Guardar el token en localStorage
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if (error.response) {
                setErrors(error.response.data.message || "Error al iniciar sesión");
            } else if (error.request) {
                setErrors("No se pudo conectar al servidor. Verifica tu conexión.");
            } else {
                setErrors("Error al procesar la solicitud de inicio de sesión");
            }
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        Cookies.remove('token');
        setErrors(null);
    };

    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await verifyToken(token);
                    setUser(res.data);
                    console.log("Usuario Autenticado:", res.data);
                } catch (error) {
                    console.error("Error al verificar token:", error.response ? error.response.data : error.message);
                    setUser(null);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        }
        checkLogin();
    }, []);
    
    return (
        <AuthContext.Provider value={{ 
            login, 
            logout, 
            user, 
            errors, 
            loading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
