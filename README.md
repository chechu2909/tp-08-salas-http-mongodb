# Trabajo Práctico 08 — Endpoints persistentes de reservas de salas

Sistema de gestión y reservas de salas de estudio (Norte, Sur y Multimedia) con persistencia en **MongoDB Atlas**, desarrollado bajo arquitectura **MVC** utilizando **Node.js, Express, Mongoose y EJS**.

---

## 1. Origen y Contexto
- **Origen de la copia:** Punto de partida basado en la evolución funcional del Trabajo Práctico 07 individual.
- **Evolución:** Se migró el almacenamiento en memoria y los archivos JSON locales hacia una base de datos persistente en la nube mediante un servicio asíncrono con Mongoose, integrando además una API JSON completa junto con el sitio web HTML.

---

## 2. Versiones y Tecnologías
- **Entorno de ejecución:** Node.js (v26.x)
- **Framework web:** Express
- **Motor de vistas:** EJS y `express-ejs-layouts`
- **Base de datos:** MongoDB Atlas (M0 Free Tier) / Mongoose ODM
- **Gestión de procesos:** Nodemon (para desarrollo)

---

## 3. Preparación y Configuración del Entorno (.env)
El repositorio **no incluye** el archivo `.env` por motivos de seguridad. Para configurar el proyecto localmente, creá un archivo llamado `.env` en la raíz del proyecto basándote en la siguiente plantilla:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/reservas_salas_u8?retryWrites=true&w=majority

4. Estructura del Proyecto por Capas
El proyecto respeta una estricta separación de responsabilidades:

src/config/: Configuración de la conexión a la base de datos (MongoDB Atlas) y control de eventos de red.

src/modelos/: Esquemas y modelos de Mongoose (definición de campos, tipos y validaciones).

src/servicios/: Lógica de negocio y operaciones asíncronas contra la base de datos.

src/controladores/: Funciones intermedias que gestionan las peticiones HTTP, diferenciando respuestas para la API JSON y renderizado para vistas HTML.

src/rutas/: Enrutadores independientes para la API (/api/reservas) y para las vistas del sitio (/, /reservas, /estado, etc.).

src/middlewares/: Manejo centralizado de errores, validaciones de entrada y captura de solicitudes.

views/: Plantillas EJS y componentes de diseño (layout.ejs).

5. Comando de Inicio
Para iniciar el servidor en modo de desarrollo con recarga automática y carga nativa de variables de entorno:

Bash
npm run dev
(O utilizando la instrucción nativa de Node.js: node --env-file=.env src/index.js)

6. Tabla de Endpoints y Rutas
API REST JSON

Método,Ruta,Descripción,Resultado Exitoso
GET,/api/reservas,Devuelve el listado completo de reservas o filtra por sala exacta (?sala=...).,200 OK + Array JSON
GET,/api/reservas/:id,Busca una reserva específica por su identificador de MongoDB.,200 OK + Objeto JSON
POST,/api/reservas,Crea un nuevo registro de reserva validando los campos permitidos.,201 Created + Cabecera Location + JSON

Vistas HTML (Navegador)

Método,Ruta,Descripción
GET,/,Portada principal y bienvenida al sistema.
GET,/reservas,Vista HTML con el listado en formato de tarjetas de las reservas existentes.
GET,/reservas/nueva,Formulario interactivo para registrar una nueva reserva.
POST,/reservas,"Recepción de datos del formulario, validación y redirección (302)."
GET,/estado,Panel de estado del sistema y conteo dinámico desde MongoDB.

7. Ejemplo de Datos (JSON de Prueba)
Cuerpo esperado para una solicitud POST exitosa a /api/reservas:

JSON
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2
}

8. Matriz de Resultados y Validación

Caso Evaluado,Resultado Observado
Listado inicial con base nueva,200 OK — Devuelve un arreglo vacío [].
Creación válida,"201 Created — Retorna el documento con estado: ""pendiente"" y cabecera Location."
Consulta por ID válido existente,200 OK — Retorna el recurso exacto.
Consulta por ID tras reinicio,200 OK — Persistencia comprobada con el mismo ID tras reiniciar el servidor.
"ID mal formado (""1"")",400 Bad Request (JSON).
ID válido inexistente,404 Not Found (JSON).
"Campos inválidos (ej. personas 7 o ""abc"")",400 Bad Request — Rechaza la escritura sin alterar la cantidad.
Filtro exacto por sala (?sala=Sala%20Norte),200 OK — Retorna únicamente coincidencias exactas o [] si no hay.
Parámetro de sala repetido (?sala=A&sala=B),400 Bad Request — Detecta el arreglo y rechaza la consulta.

9. Prueba de Persistencia y Reinicio

Se consultó el listado mediante GET /api/reservas, registrando la cantidad inicial.

Se envió un POST a /api/reservas, obteniendo el estado 201 y la URL en la cabecera Location.

Se detuvo por completo el proceso de Node.js en la terminal.

Se volvió a iniciar el servidor mediante npm run dev.

Se consultó nuevamente el recurso mediante GET /api/reservas/ID_RECIBIDO, comprobando que los datos se mantienen intactos y la cantidad de registros en la colección de MongoDB Atlas es estable.

