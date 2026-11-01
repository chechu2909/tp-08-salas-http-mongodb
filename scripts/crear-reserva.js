const { conectarDB, desconectarDB } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");
async function main() {
  try {
    await conectarDB();

    const nuevaReserva = new Reserva({
      estudiante: "JuanPerez",
      email: "juan.perez@example.com",
      sala: "Sala Norte",
      fecha: "2026-10-30",
      turno: "Mañana",
      personas: 3,
    });

    const reservaGuardada = await nuevaReserva.save();
    console.log(
      "Reserva creada exitosamente con _id:",
      reservaGuardada._id.toString(),
    );
  } catch (error) {
    console.error("Error al crear la reserva:", error.message);
    process.exit(1);
  } finally {
    await desconectarDB();
  }
}

main();
