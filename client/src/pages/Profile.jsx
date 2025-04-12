import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
            setFormData({
                nombre: data.nombre || '',
                email: data.email || '',
                telefono: data.telefono || '',
                direccion: data.direccion || ''
            });
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            setError('Error al cargar el perfil');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await profileService.updateProfile(formData);
            setEditMode(false);
            loadProfile();
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setError('Error al actualizar el perfil');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            await profileService.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setError(null);
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            setError('Error al actualizar la contraseña');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="text-center p-4">Cargando...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
                
                {/* Información del Perfil */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Información Personal</h3>
                    {!editMode ? (
                        <div className="space-y-4">
                            <p><strong>Nombre:</strong> {profile.nombre}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Teléfono:</strong> {profile.telefono || 'No especificado'}</p>
                            <p><strong>Dirección:</strong> {profile.direccion || 'No especificada'}</p>
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Editar Perfil
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Cambio de Contraseña */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Cambiar Contraseña</h3>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block mb-1">Contraseña Actual</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Nueva Contraseña</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Cambiar Contraseña
                        </button>
                    </form>
                </div>

                {/* Botón de Cerrar Sesión */}
                <div className="mt-6">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile; 