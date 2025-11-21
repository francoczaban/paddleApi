# 🎾 Paddle UADE - Backend API

API REST para la gestión de partidos de pádel. Desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- ✅ Autenticación JWT
- ✅ CRUD completo de jugadores
- ✅ Gestión de partidos con equipos
- ✅ Subida de imágenes de jugadores
- ✅ Autorización por roles (Admin/Usuario)
- ✅ Validación de datos
- ✅ Endpoints RESTful
- ✅ Script de seed para usuario admin

## 📜 Scripts Disponibles

```bash
npm start          # Inicia el servidor en modo producción
npm run dev        # Inicia el servidor en modo desarrollo con nodemon
npm run seed       # Crea el usuario administrador en la base de datos
```

## 🛠️ Stack Tecnológico

- **Node.js** + **Express** - Framework del servidor
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **Multer** - Subida de archivos
- **CORS** - Políticas de origen cruzado
- **dotenv** - Variables de entorno

## 📁 Estructura del Proyecto

```
paddle-uade-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración MongoDB
│   ├── models/
│   │   ├── User.js              # Modelo de usuarios
│   │   ├── Player.js            # Modelo de jugadores
│   │   └── Match.js             # Modelo de partidos
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   ├── players.js           # Rutas de jugadores
│   │   ├── matches.js           # Rutas de partidos
│   │   └── upload.js            # Rutas de subida de imágenes
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación
│   │   └── adminAuth.js         # Middleware de autorización admin
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticación
│   │   ├── playerController.js  # Controlador de jugadores
│   │   └── matchController.js   # Controlador de partidos
│   └── server.js                # Servidor principal
├── uploads/
│   └── players/                 # Imágenes de jugadores
├── .env                         # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd paddle-uade-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
copy .env.example .env
```

Editar `.env` con tus configuraciones:

```env
MONGODB_URI=mongodb://localhost:27017/paddle-uade
JWT_SECRET=tu-clave-secreta-super-segura-minimo-32-caracteres
PORT=3000
NODE_ENV=development
```

### 4. Iniciar MongoDB

Asegúrate de tener MongoDB instalado y corriendo:

```bash
# Windows (si está instalado como servicio)
net start MongoDB

# O usando mongod directamente
mongod
```

### 5. Crear usuario administrador (opcional)

Ejecutar el script de seed para crear el usuario admin:

```bash
npm run seed
```

Credenciales del admin:
- **Email:** admin@paddle.com
- **Password:** admin123

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción.

### 6. Iniciar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 API Endpoints

### 🔐 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Obtener usuario actual | Sí |

**Ejemplo - Registro:**
```json
POST /api/auth/register
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Juan Pérez"
}
```

**Ejemplo - Login:**
```json
POST /api/auth/login
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

### 👥 Jugadores

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/players` | Listar todos los jugadores | No |
| GET | `/api/players/:id` | Obtener jugador por ID | No |
| POST | `/api/players` | Crear nuevo jugador | Sí |
| PUT | `/api/players/:id` | Actualizar jugador | Sí |
| DELETE | `/api/players/:id` | Eliminar jugador | Sí (Admin) |

**Ejemplo - Crear jugador:**
```json
POST /api/players
Headers: { "Authorization": "Bearer <token>" }
{
  "firstName": "Carlos",
  "lastName": "Rodríguez",
  "age": 28,
  "nationality": "Argentina",
  "imageUrl": "http://localhost:3000/uploads/players/player-123456.jpg"
}
```

### 🎾 Partidos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/matches` | Listar todos los partidos | No |
| GET | `/api/matches/:id` | Obtener partido por ID | No |
| GET | `/api/matches/player/:playerId` | Partidos de un jugador | No |
| POST | `/api/matches` | Crear nuevo partido | Sí |
| PUT | `/api/matches/:id` | Actualizar partido | Sí |
| DELETE | `/api/matches/:id` | Eliminar partido | Sí (Admin) |

**Ejemplo - Crear partido:**
```json
POST /api/matches
Headers: { "Authorization": "Bearer <token>" }
{
  "date": "2024-01-15T18:00:00Z",
  "team1Players": ["player_id_1", "player_id_2"],
  "team2Players": ["player_id_3", "player_id_4"],
  "sets": [
    { "team1Score": 6, "team2Score": 4 },
    { "team1Score": 6, "team2Score": 3 }
  ],
  "notes": "Partido amistoso"
}
```

### 📸 Subida de Imágenes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload/player-image` | Subir imagen de jugador | Sí |

**Ejemplo - Subir imagen:**
```
POST /api/upload/player-image
Headers: { "Authorization": "Bearer <token>" }
Content-Type: multipart/form-data
Body: { "image": <archivo> }
```

## 🔑 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. 

### Uso del Token

1. Obtén el token mediante login o registro
2. Incluye el token en el header de las peticiones protegidas:

```
Authorization: Bearer <tu-token-jwt>
```

### Expiración

Los tokens expiran después de **7 días**.

## 👤 Usuario Admin por Defecto

### Opción 1: Usando el script de seed (Recomendado)

Ejecuta el siguiente comando para crear automáticamente el usuario admin:

```bash
npm run seed
```

Esto creará un usuario con:
- **Email:** admin@paddle.com
- **Password:** admin123
- **isAdmin:** true

### Opción 2: Manualmente en MongoDB

Si prefieres hacerlo manualmente, conecta a MongoDB y ejecuta:

```javascript
use paddle-uade

db.users.updateOne(
  { email: "admin@paddle.com" },
  { $set: { isAdmin: true } }
)
```

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT con expiración
- ✅ CORS configurado
- ✅ Validación de tipos de archivo
- ✅ Límite de tamaño de archivo (5MB)
- ✅ Validación de datos de entrada

## 📝 Modelos de Datos

### User
```javascript
{
  email: String (único, requerido),
  password: String (hasheado, requerido),
  name: String,
  isAdmin: Boolean (default: false),
  createdAt: Date
}
```

### Player
```javascript
{
  firstName: String (requerido),
  lastName: String (requerido),
  age: Number (requerido),
  nationality: String (requerido),
  imageUrl: String,
  createdAt: Date
}
```

### Match
```javascript
{
  date: Date (requerido),
  team1Players: [ObjectId] (2 jugadores),
  team2Players: [ObjectId] (2 jugadores),
  sets: [{
    team1Score: Number,
    team2Score: Number
  }],
  notes: String,
  createdBy: ObjectId (User),
  createdAt: Date
}
```

## 🧪 Testing con Postman/Thunder Client

Importa la colección de endpoints o prueba manualmente:

1. **Registrar usuario** → Obtienes token
2. **Crear jugadores** → Necesitas 4 jugadores
3. **Crear partido** → Usa los IDs de los jugadores
4. **Listar partidos** → Ver todos los partidos

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solución:** Asegúrate de que MongoDB esté corriendo

### Error de autenticación
```
No autorizado, no se proporcionó token
```
**Solución:** Incluye el header `Authorization: Bearer <token>`

### Error al subir imágenes
```
Solo se permiten imágenes (jpeg, jpg, png, gif, webp)
```
**Solución:** Verifica que el archivo sea una imagen válida

## 📄 Licencia

ISC

## 👨‍💻 Autor

Proyecto desarrollado para UADE - Universidad Argentina de la Empresa

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.
