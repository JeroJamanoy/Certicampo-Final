import { useState, useEffect } from 'react';
import { cultivosService } from '../../services/cultivosService';
import './RegistroCultivos.css';
import calibracion from '../../assets/Imagenes_Plantillas/Calibracion_Verificacion_y_Mantenimiento_de_Equipos_de_Aspersion.webp';
import fertilizantesFoliares from '../../assets/Imagenes_Plantillas/Inventario_de_Fertilizantes_Foliares_y_Bioestimulantes.webp';
import fertilizantesEdaficos from '../../assets/Imagenes_Plantillas/Inventario_de_Fertilizantes_Edaficos.webp';
import productos from '../../assets/Imagenes_Plantillas/Inventario_de_Productos_Fitosanitarios.webp';
import plagasEnfermedades from '../../assets/Imagenes_Plantillas/Monitoreo_de_Plagas_y_Enfermedades.webp';
import registroAplicacionFertilizantes from '../../assets/Imagenes_Plantillas/Registro_de_Aplicacion_de_Fertilizantes_y_Enmiendas.webp';
import registroAplicacionFitosanitarios from '../../assets/Imagenes_Plantillas/Registro_de_Aplicaciones_Fitosanitarias_y_Foliares.webp';


function RegistroCultivos() {
    const [cultivos, setCultivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cultivoEditando, setCultivoEditando] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        cultivation: '',
        files: ''
    });

    useEffect(() => {
        cargarCultivos();
    }, []);

    const cargarCultivos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await cultivosService.getAllCultivos();
            if (Array.isArray(data)) {
                setCultivos(data);
            } else {
                console.error('La respuesta no es un array:', data);
                setError('Error en el formato de datos recibidos');
            }
        } catch (err) {
            let mensajeError = 'Error al cargar los cultivos';
            if (err.response) {
                mensajeError += `: ${err.response.data?.message || err.response.statusText}`;
            } else if (err.message === 'No hay token de autenticación') {
                mensajeError = 'Por favor, inicia sesión para ver tus cultivos';
            } else if (err.request) {
                mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
            }
            setError(mensajeError);
            console.error('Error completo:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNuevoRegistro = () => {
        setCultivoEditando(null);
        setFormData({
            name: '',
            cultivation: '',
            files: ''
        });
        setShowModal(true);
    };

    const handleEditar = (cultivo) => {
        setCultivoEditando(cultivo);
        setFormData({
            name: cultivo.name,
            cultivation: cultivo.cultivation,
            files: cultivo.files
        });
        setShowModal(true);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cultivo?')) {
            try {
                await cultivosService.deleteCultivo(id);
                await cargarCultivos();
                alert('Cultivo eliminado con éxito');
            } catch (error) {
                alert('Error al eliminar el cultivo: ' + error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (cultivoEditando) {
                await cultivosService.updateCultivo(cultivoEditando._id, formData);
                alert('Cultivo actualizado con éxito');
            } else {
                await cultivosService.createCultivo(formData);
                alert('Cultivo registrado con éxito');
            }
            setShowModal(false);
            await cargarCultivos();
        } catch (error) {
            alert('Error al guardar el cultivo: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatearFecha = (fecha) => {
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return 'Fecha no válida';
        }
    };

    const plantillas = [
        {
            nombre: 'Calibración, Verificación y Mantenimiento de Equipos de Aspersión',
            url: 'https://docs.google.com/spreadsheets/d/1ceoRx4YcA37hKxTn7WbkENIFRDiS8UYY/edit?usp=sharing&ouid=105021368371548464906&rtpof=true&sd=true',
            imagen: calibracion
        },
        {
            nombre: 'Inventario de Fertilizantes Foliares y Bioestimulantes',
            url: 'https://docs.google.com/spreadsheets/d/1ODDi1alMbgzYVeynQzyid7RTlUolbeFP/edit?usp=sharing&ouid=105021368371548464906&rtpof=true&sd=true',
            imagen: fertilizantesFoliares
        },
        {
            nombre: 'Inventario de Fertilizantes Edaficos',
            url: 'https://docs.google.com/spreadsheets/d/1fDpxTQYWwM9jPxzudYbVEnjSvXjNleis/edit?usp=sharing&ouid=105021368371548464906&rtpof=true&sd=true',
            imagen: fertilizantesEdaficos
        },
        {
            nombre: 'Inventario de Productos Fitosanitarios',
            url: 'https://docs.google.com/spreadsheets/d/1NcrtkSxqw9MrMgVPM6F4hcULLZ_CPR8u/edit?usp=sharing&ouid=105021368371548464906&rtpof=true&sd=true',
            imagen: productos
        },
        {
            nombre: 'Monitoreo de Plagas y Enfermedades',
            url: 'https://docs.google.com/spreadsheets/d/1_i0V5y8Xv_oiXLLNppwa9gQTufQYSU-_/edit?usp=sharing&ouid=105021368371548464906&rtpof=true&sd=true',
            imagen: plagasEnfermedades
        },
        {
            nombre: 'Registro de Aplicación de Fertilizantes y Enmiendas',
            url: 'https://docs.google.com/spreadsheets/d/1vDCWWvScFqPFM6txtB4cpvcwTf_YhPeQ/edit?usp=sharing&ouid=105021368371548464906&rtpof=true&sd=true',
            imagen: registroAplicacionFertilizantes
        },
        {
            nombre: 'Registro de Aplicaciones Fitosanitarias y Foliares',
            url: 'https://docs.google.com/spreadsheets/d/1iSd5XYdpNfZEbmCDvzj2rCIkYxxOrRbF/edit?usp=sharing&ouid=105021368371548464906&rtpof=true&sd=true',
            imagen: registroAplicacionFitosanitarios
        }
    ]

    if (loading) {
        return (
            <div className="background-registro-cultivos">
                <div className="registro-cultivos-container">
                    <div className="loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Cargando cultivos...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="background-registro-cultivos">
                <div className="registro-cultivos-container">
                    <div className="error">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{error}</p>
                        <button onClick={cargarCultivos} className="btn-reintentar">
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="background-registro-cultivos">
            <div className="registro-cultivos-container">
                <h1>Registro de Cultivos</h1>
                
                <div className="cultivos-grid">
                    <div className="nuevo-cultivo">
                        <h2>Registrar Nuevo Cultivo</h2>
                        <button className="btn-nuevo" onClick={handleNuevoRegistro}>
                            <i className="fas fa-plus"></i> Nuevo Registro
                        </button>
                    </div>

                    <div className="lista-cultivos">
                        <h2>Mis Cultivos Registrados</h2>
                        {cultivos.length === 0 ? (
                            <div className="no-cultivos">
                                <i className="fas fa-seedling"></i>
                                <p>No hay cultivos registrados</p>
                                <p>¡Comienza registrando tu primer cultivo!</p>
                            </div>
                        ) : (
                            cultivos.map((cultivo) => (
                                <div key={cultivo._id} className="cultivo-card">
                                    <div className="cultivo-header">
                                        <h3>{cultivo.name}</h3>
                                        <span className="fecha">{formatearFecha(cultivo.date)}</span>
                                    </div>
                                    <div className="cultivo-info">
                                        <p><strong>Tipo:</strong> {cultivo.cultivation}</p>
                                        <p><strong>Archivo:</strong> {cultivo.files}</p>
                                    </div>
                                    <div className="cultivo-actions">
                                        <button className="btn-editar" onClick={() => handleEditar(cultivo)}>
                                            <i className="fas fa-edit"></i> Editar
                                        </button>
                                        <button className="btn-eliminar" onClick={() => handleEliminar(cultivo._id)}>
                                            <i className="fas fa-trash"></i> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{cultivoEditando ? 'Editar Cultivo' : 'Nuevo Cultivo'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre del Registro:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cultivation">Tipo de Cultivo:</label>
                                    <input
                                        type="text"
                                        id="cultivation"
                                        name="cultivation"
                                        value={formData.cultivation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="plantillas-container">
                                    {plantillas.map((plantilla, index) => (
                                        <a
                                        key={index}
                                        href={plantilla.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="card"
                                        style={{
                                            backgroundImage: `url(${plantilla.imagen})`,
                                        }}
                                        >
                                        <div className="card-text">
                                            {plantilla.nombre}
                                        </div>
                                        </a>
                                    ))}
                                    
                                </div>
                                <div className="explicativo-plantillas-parrafo">
                                    <a href="https://chatgpt.com/c/6814e411-73f4-800f-a6fe-25a4fb87cf79">Video explicativo sobre las plantillas</a>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="files">Enlace del archivo:</label>
                                    <input
                                        type="text"
                                        id="files"
                                        name="files"
                                        value={formData.files}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="btn-guardar">
                                        {cultivoEditando ? 'Actualizar' : 'Guardar'}
                                    </button>
                                    <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegistroCultivos;