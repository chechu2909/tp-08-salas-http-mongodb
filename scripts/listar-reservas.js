const { conectarDB, desconectarDB } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function main() {
  try {
    await conectarDB();

    // Consultar todas las reservas en la base de datos
    const reservas = await Reserva.find();
    
    console.log(`\nSe encontraron ${reservas.length} reserva(s) en la base de datos:`);
    console.table(reservas.map(r => ({
      ID: r._id.toString(),
      Estudiante: r.estudiante,
      Sala: r.sala,
      Fecha: r.fecha,
      Turno: r.turno,
      Estado: r.estado
    })));

  } catch (error) {
    console.error("Error al listar las reservas:", error.message);
    process.exit(1);
  } finally {
    await desconectarDB();
    process.exit(0); // Libera la terminal al terminar
  }
}

main();