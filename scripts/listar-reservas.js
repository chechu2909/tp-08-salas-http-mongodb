const { conectarDB, desconectarDB } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");
async function main() {
  try {
    await conectarDB();

    const reservas = await Reserva.find({});
    console.log(`Cantidad de reservas recuperadas: ${reservas.length}`);
    reservas.forEach((r, index) => {
      console.log(
        `[${index + 1}] ID: ${r._id} | Estudiante: ${r.estudiante} | Sala: ${r.sala} | Turno: ${r.turno} | Personas: ${r.personas}`,
      );
    });
  } catch (error) {
    console.error("Error al listar reservas:", error.message);
    process.exit(1);
  } finally {
    await desconectarDB();
  }
}

main();
