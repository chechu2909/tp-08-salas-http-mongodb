const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('La URI de MongoDB Atlas no está definida en las variables de entorno.');
    }

    await mongoose.connect(uri);
    console.log('Conexión exitosa a MongoDB Atlas (base: reservas_salas_u8)');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1); // El servidor no arranca si falla la conexión
  }
};

module.exports = { conectarDB };