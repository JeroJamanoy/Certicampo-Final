import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        // Usar MongoDB Atlas
        const uri = process.env.MONGODB_URI || "mongodb+srv://User:User@cluster0.ykx1h.mongodb.net/certicampo?retryWrites=true&w=majority&appName=Cluster0";
        
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
        });
        
        console.log("Conexión exitosa a MongoDB Atlas");
    } catch(e) {
        console.log("Error conectando a MongoDB Atlas:", e.message);
        console.log("Creando una base de datos en memoria para pruebas...");
        
        // Crear usuarios de prueba manualmente
        await createTestUsers();
    };
};

// Función para crear usuarios de prueba si no se puede conectar a MongoDB
async function createTestUsers() {
    // Simular la colección de usuarios con un arreglo global
    global.users = [
        {
            _id: "1",
            userid: "1054859914",
            password: "$2a$10$XfAeSJ.1YKFYCAp1xqJzxe.20NQrAUy.q3fT.9JK2xn19WHnlzQW6", // Contraseña: 1054859914 (encriptada)
            name: "Usuario de Prueba",
            email: "usuario@test.com",
            number_phone: "1234567890",
            role: "user"
        }
    ];
    
    // Reemplazar métodos de User.findOne y User.findById
    mongoose.model = function(name) {
        if (name === 'User') {
            return {
                findOne: async function(query) {
                    if (query.userid) {
                        return global.users.find(user => user.userid === query.userid) || null;
                    }
                    return null;
                },
                findById: async function(id) {
                    return global.users.find(user => user._id === id) || null;
                }
            };
        }
        return {};
    };
    
    console.log("Base de datos en memoria creada con usuario de prueba");
    console.log("Puedes iniciar sesión con: 1054859914 y contraseña: 1054859914");
}