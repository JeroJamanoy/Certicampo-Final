import { useState, useEffect } from 'react';
import './Perfil.css';

function Perfil() {
    const [usuario, setUsuario] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        foto: null
    });

    const [editando, setEditando] = useState(false);

    useEffect(() => {
        // Aquí se cargará la información del usuario
        // TODO: Implementar llamada a la API
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implementar actualización de perfil
        setEditando(false);
    };

    return (
        <div className="perfil-container">
            <h1>Mi Perfil</h1>
            
            <div className="perfil-content">
                <div className="perfil-header">
                    <div className="foto-perfil">
                        {usuario.foto ? (
                            <img src={usuario.foto} alt="Foto de perfil" />
                        ) : (
                            <div className="foto-placeholder">
                                <i className="fas fa-user"></i>
                            </div>
                        )}
                        {editando && (
                            <button className="btn-cambiar-foto">
                                Cambiar foto
                            </button>
                        )}
                    </div>
                </div>

                <div className="perfil-info">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={usuario.nombre}
                                onChange={(e) => setUsuario({...usuario, nombre: e.target.value})}
                                disabled={!editando}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={usuario.email}
                                onChange={(e) => setUsuario({...usuario, email: e.target.value})}
                                disabled={!editando}
                            />
                        </div>

                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                value={usuario.telefono}
                                onChange={(e) => setUsuario({...usuario, telefono: e.target.value})}
                                disabled={!editando}
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección</label>
                            <textarea
                                value={usuario.direccion}
                                onChange={(e) => setUsuario({...usuario, direccion: e.target.value})}
                                disabled={!editando}
                                rows="3"
                            />
                        </div>

                        <div className="perfil-actions">
                            {editando ? (
                                <>
                                    <button type="submit" className="btn-guardar">
                                        Guardar Cambios
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-cancelar"
                                        onClick={() => setEditando(false)}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="btn-editar"
                                    onClick={() => setEditando(true)}
                                >
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Perfil; 