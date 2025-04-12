import { useState, useEffect } from 'react';
import './Certificados.css';

function Certificados() {
    const [certificados, setCertificados] = useState([]);

    useEffect(() => {
        // Simulación de carga de certificados
        setCertificados([
            { id: 1, titulo: 'Certificado de Cultivo Orgánico' },
            { id: 2, titulo: 'Certificado de Buenas Prácticas' }
        ]);
    }, []);

    return (
        <div className="certificados-container">
            <h1>Certificados</h1>
            <div className="certificados-grid">
                <div className="certificado-nuevo">
                    <h2>Solicitar Nuevo Certificado</h2>
                    <button className="btn-solicitar">
                        Solicitar Certificado
                    </button>
                </div>
                <div className="certificados-lista">
                    <h2>Mis Certificados</h2>
                    {certificados.length === 0 ? (
                        <p>No tienes certificados generados</p>
                    ) : (
                        certificados.map((certificado) => (
                            <div key={certificado.id} className="certificado-item">
                                {/* Contenido del certificado */}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Certificados; 