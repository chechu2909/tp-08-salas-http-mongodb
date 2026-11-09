# TP 09: Actualización y Eliminación de Reservas de Salas (MongoDB & Mongoose)

Proyecto backend desarrollado con **Node.js**, **Express** y **MongoDB Atlas / Mongoose** para la gestión completa del CRUD de reservas de salas, incluyendo endpoints JSON para la API y vistas HTML servidas desde el servidor.

---

## 1. Información General y Entorno

- **Repositorio de origen:** Copia estructurada y evolucionada a partir del TP 08.
- **Entorno de datos:** MongoDB Atlas (base de datos `reservas_salas_u9`, colección `reservas`).
- **Ajuste DNS:** Configuración externa mediante `dns.setDefaultResultOrder('ipv4first')` para asegurar compatibilidad de resolución en la conexión con Atlas.
- **Formato:** Proceso basado en módulos CommonJS (`require` / `module.exports`).

---

## 2. Estructura y Capas del Proyecto

El código está organizado bajo el patrón de arquitectura por capas dentro del directorio `src/`:

- `src/modelos/`: Esquemas de Mongoose con validaciones a nivel de campo (tipos, enums, límites numéricos y valores por defecto).
- `src/servicios/`: Lógica de negocio y persistencia asíncrona desacoplada del protocolo HTTP.
- `src/controladores/`: Manejo de solicitudes/respuestas HTTP, validación de parámetros (ej. `mongoose.Types.ObjectId.isValid`), selección de estados HTTP (`200`, `201`, `204`, `400`, `404`, `500`) y renderizado de vistas.
- `src/rutas/`: Definición de endpoints y enrutamiento separado para la API (`/api/reservas`) y las vistas HTML.

---

## 3. Contratos HTTP de la API

| Método | Endpoint | Descripción | Respuestas |
|---|---|---|---|
| **POST** | `/api/reservas` | Creación de reserva. Asigna `estado: "pendiente"` por defecto. | `201 Created` (con cabecera `Location` y recurso creado), `400 Bad Request`. |
| **GET** | `/api/reservas` | Listado simple de reservas como arreglo JSON. | `200 OK`. |
| **GET** | `/api/reservas/:id` | Detalle individual de reserva por ID. | `200 OK` o `404 Not Found` (si no existe) / `400 Bad Request` (ID mal formado). |
| **PUT** | `/api/reservas/:id` | Reemplazo completo (requiere los 7 campos editables). | `200 OK`, `400 Bad Request`, `404 Not Found`. |
| **PATCH** | `/api/reservas/:id` | Actualización parcial (`personas` y/o `estado`). | `200 OK`, `400 Bad Request`, `404 Not Found`. |
| **DELETE** | `/api/reservas/:id` | Eliminación física definitiva de la reserva. | `204 No Content` (cuerpo vacío), `404 Not Found`, `400 Bad Request`. |

---

## 4. Reglas de Validación y Negocio

- **estudiante:** Texto obligatorio (`trim`).
- **email:** Texto obligatorio con formato válido (`@`).
- **sala:** Debe coincidir con uno de los valores permitidos (`Sala Norte`, `Sala Sur`, `Sala Multimedia`).
- **fecha:** Texto obligatorio (`trim`).
- **turno:** Debe coincidir con `Mañana`, `Tarde` o `Noche`.
- **personas:** Número entero estricto entre 1 y 6. Se rechazan flotantes, rangos fuera de límite, objetos y arreglos.
- **estado:** Admite únicamente `pendiente` o `confirmada`.
- **POST:** No permite la asignación manual de `_id` ni de `estado` por parte del cliente.
- **PUT / PATCH:** Operan con `runValidators: true` y `upsert: false`. Se filtran y rechazan campos desconocidos o prohibidos (`_id`, `$set`, etc.).

---

## 5. Colección de Pruebas en Bruno

Las pruebas de la API han sido organizadas y guardadas dentro de la carpeta `TP09-Salas/` del repositorio, divididas en dos carpetas principales:

1. **Endpoints Principales:**
   - `POST Crear Reserva` (Valida código `201` y cabecera `Location`).
   - `GET listar reservas` (Listado general).
   - `PUT remplazo completo` (Actualización de los 7 campos).
   - `PATCH actualizar reserva` (Cambios parciales).
   - `DEL eliminar reserva` (Validación de código `204 No Content`).

2. **Pruebas de Validación y Errores:**
   - `PUT Probar personas con valor inválido` (Responde `400 Bad Request`).
   - `GET ID inexistente - No encontrado` (Responde `404 Not Found`).
   - `PUT ID mal formado` (Responde `400 Bad Request`).

---

## 6. Evidencia de Persistencia y Continuidad

- **Reinicio del Servidor:** Al realizar operaciones de modificación (`PUT`/`PATCH`) o eliminación (`DELETE`), apagar el servidor y volver a iniciarlo, se constata la permanencia de los cambios directamente en MongoDB Atlas.
- **Ruta `/estado`:** Continúa mostrando en tiempo real la cantidad exacta de documentos persistidos en la base de datos.
- **Criterio de Borrado:** Se implementó borrado físico mediante `.findByIdAndDelete()`. Consultas posteriores (`GET` o `DELETE`) sobre un ID ya eliminado devuelven consistentemente un estado `404 Not Found`.

---

## 7. Instrucciones para Ejecución

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install

Configurar el archivo .env con la cadena de conexión a MongoDB Atlas (MONGODB_URI) y el puerto.

Iniciar el servidor en modo desarrollo / producción:

Bash
npm start