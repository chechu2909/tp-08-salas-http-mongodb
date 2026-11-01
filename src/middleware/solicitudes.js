let contadorSolicitudes = 1;

function identificarSolicitud(req, res, next) {
  const id = `BIB-${String(contadorSolicitudes++).padStart(3, "0")}`;
  req.idSolicitud = id;
  res.locals.idSolicitud = id;
  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(inicio);
    const duracionMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const id = res.locals.idSolicitud || req.idSolicitud || "BIB-000";
    const metodo = req.method;
    const url = req.originalUrl || req.url;
    const estado = res.statusCode;

    console.log(
      `[${id}] ${metodo} ${url} - Status: ${estado} - Duración: ${duracionMs}ms`,
    );
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
