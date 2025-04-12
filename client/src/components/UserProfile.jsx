import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number_phone: '',
        userid: ''
    });

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const data = await userService.getUserProfile();
            setUser(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                number_phone: data.number_phone || '',
                userid: data.userid || ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await userService.updateUserProfile(formData);
            setUser(updatedUser);
            setEditMode(false);
            setError(null);
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setError('Error al actualizar el perfil');
        }
    };

    if (loading) return <div className="text-center p-4">Cargando...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Información del Usuario</h2>
                
                {!editMode ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">ID de Usuario:</p>
                                <p className="font-semibold">{user.userid}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Nombre:</p>
                                <p className="font-semibold">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email:</p>
                                <p className="font-semibold">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Teléfono:</p>
                                <p className="font-semibold">{user.number_phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Rol:</p>
                                <p className="font-semibold">{user.role}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Fecha de Creación:</p>
                                <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setEditMode(true)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Editar Información
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 mb-1">ID de Usuario</label>
                            <input
                                type="text"
                                name="userid"
                                value={formData.userid}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">Email</label>
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
                            <label className="block text-gray-600 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                name="number_phone"
                                value={formData.number_phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
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
        </div>
    );
};

export default UserProfile; 