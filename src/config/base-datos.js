const mongoose = require("mongoose");
const dns = require("node:dns");
const { mongodbUri } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarDB() {
  if (!mongodbUri || !mongodbUri.startsWith("mongodb")) {
    console.error("Error: MONGODB_URI no está definida o es inválida.");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongodbUri);
    console.log("Conexión exitosa a MongoDB Atlas.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    process.exit(1);
  }
}

async function desconectarDB() {
  try {
    await mongoose.disconnect();
    console.log("Desconexión de MongoDB Atlas.");
  } catch (error) {
    console.error("Error al desconectar:", error.message);
  }
}

module.exports = { conectarDB, desconectarDB };
