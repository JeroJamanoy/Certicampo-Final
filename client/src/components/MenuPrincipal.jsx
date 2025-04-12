import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import './MenuPrincipal.css';

function MenuPrincipal() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setMenuOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Detectar cambios en tamaño de ventana
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    // Si no hay usuario autenticado, no mostrar el menú
    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/inicio">
                    <img src="src/assets/Logo.png" alt="CertiCampo Logo" />
                    <span>CertiCampo</span>
                </Link>
            </div>
            
            <div className="menu">
                <div className={`menu-links ${menuOpen ? 'active' : ''}`}>
                    <Link to="/inicio" onClick={() => setMenuOpen(false)}>
                        Inicio
                    </Link>
                    <Link to="/registro-cultivos" onClick={() => setMenuOpen(false)}>
                        Registro Cultivos
                    </Link>
                    <Link to="/certificados" onClick={() => setMenuOpen(false)}>
                        Certificados
                    </Link>
                    <Link to="/foro" onClick={() => setMenuOpen(false)}>
                        Foro
                    </Link>
                    <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                        Mi Perfil
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Cerrar Sesión
                    </button>
                </div>
                
                {isMobile && (
                    <div className="menu-btn" onClick={toggleMenu}>
                        <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default MenuPrincipal;