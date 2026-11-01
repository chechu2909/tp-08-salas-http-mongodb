const { conectarDB, desconectarDB } = require("../src/config/base-datos");

async function main() {
  try {
    await conectarDB();
    console.log("¡Prueba de conexión finalizada con éxito!");
  } finally {
    await desconectarDB();
  }
}

main().catch((error) => {
  console.error("No se pudo completar la conexión:", error);
  process.exitCode = 1;
});