# 🧪 Ejemplos de Peticiones HTTP

Este archivo contiene ejemplos de todas las peticiones disponibles en la API.
Puedes usar estas peticiones con Postman, Thunder Client, o cualquier cliente HTTP.

---

## 🔐 AUTENTICACIÓN

### Registrar Usuario
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Juan Pérez"
}
```

### Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@paddle.com",
  "password": "admin123"
}
```

### Obtener Usuario Actual
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 👥 JUGADORES

### Listar Todos los Jugadores
```http
GET http://localhost:3000/api/players
```

### Obtener Jugador por ID
```http
GET http://localhost:3000/api/players/PLAYER_ID_HERE
```

### Crear Jugador
```http
POST http://localhost:3000/api/players
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "firstName": "Carlos",
  "lastName": "Rodríguez",
  "age": 28,
  "nationality": "Argentina",
  "imageUrl": "http://localhost:3000/uploads/players/player-123456.jpg"
}
```

### Actualizar Jugador
```http
PUT http://localhost:3000/api/players/PLAYER_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "firstName": "Carlos",
  "lastName": "Rodríguez González",
  "age": 29,
  "nationality": "Argentina"
}
```

### Eliminar Jugador (Solo Admin)
```http
DELETE http://localhost:3000/api/players/PLAYER_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🎾 PARTIDOS

### Listar Todos los Partidos
```http
GET http://localhost:3000/api/matches
```

### Obtener Partido por ID
```http
GET http://localhost:3000/api/matches/MATCH_ID_HERE
```

### Obtener Partidos de un Jugador
```http
GET http://localhost:3000/api/matches/player/PLAYER_ID_HERE
```

### Crear Partido
```http
POST http://localhost:3000/api/matches
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "date": "2024-01-15T18:00:00Z",
  "team1Players": ["PLAYER_ID_1", "PLAYER_ID_2"],
  "team2Players": ["PLAYER_ID_3", "PLAYER_ID_4"],
  "sets": [
    { "team1Score": 6, "team2Score": 4 },
    { "team1Score": 6, "team2Score": 3 }
  ],
  "notes": "Partido amistoso - Final del torneo"
}
```

### Actualizar Partido
```http
PUT http://localhost:3000/api/matches/MATCH_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "sets": [
    { "team1Score": 6, "team2Score": 4 },
    { "team1Score": 5, "team2Score": 7 },
    { "team1Score": 6, "team2Score": 3 }
  ],
  "notes": "Partido muy reñido"
}
```

### Eliminar Partido (Solo Admin)
```http
DELETE http://localhost:3000/api/matches/MATCH_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 📸 SUBIDA DE IMÁGENES

### Subir Imagen de Jugador
```http
POST http://localhost:3000/api/upload/player-image
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: multipart/form-data

# En Postman/Thunder Client:
# - Selecciona "form-data"
# - Key: "image" (tipo: File)
# - Value: selecciona una imagen desde tu computadora
```

---

## 📋 FLUJO COMPLETO DE EJEMPLO

### 1. Registrar un usuario
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "test123",
  "name": "Usuario Test"
}
```

### 2. Login y obtener token
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "test123"
}
```
**Respuesta:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "test@test.com",
    "name": "Usuario Test",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Crear 4 jugadores (usa el token del paso 2)
```http
POST http://localhost:3000/api/players
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "García",
  "age": 25,
  "nationality": "Argentina"
}
```
**Repite para crear 4 jugadores y guarda sus IDs**

### 4. Crear un partido con los jugadores
```http
POST http://localhost:3000/api/matches
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "date": "2024-01-15T18:00:00Z",
  "team1Players": ["PLAYER_ID_1", "PLAYER_ID_2"],
  "team2Players": ["PLAYER_ID_3", "PLAYER_ID_4"],
  "sets": [
    { "team1Score": 6, "team2Score": 4 },
    { "team1Score": 6, "team2Score": 2 }
  ],
  "notes": "Mi primer partido"
}
```

### 5. Listar todos los partidos
```http
GET http://localhost:3000/api/matches
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Reemplaza los placeholders:**
   - `YOUR_JWT_TOKEN_HERE` → Token JWT obtenido del login
   - `PLAYER_ID_HERE` → ID real de un jugador
   - `MATCH_ID_HERE` → ID real de un partido

2. **Formato de fecha:**
   - Usa formato ISO 8601: `2024-01-15T18:00:00Z`
   - O simplemente envía la fecha actual (se usará por defecto)

3. **Validaciones:**
   - Los emails deben ser válidos
   - Las contraseñas deben tener al menos 6 caracteres
   - Cada equipo debe tener exactamente 2 jugadores
   - Los 4 jugadores deben ser diferentes

4. **Autorización:**
   - Las rutas marcadas con `(Solo Admin)` requieren que `isAdmin: true`
   - Todas las rutas `POST`, `PUT` requieren autenticación
   - Las rutas `DELETE` requieren permisos de admin

---

## 🎯 TESTING RÁPIDO

**Para probar rápidamente toda la API:**

1. Ejecuta `npm run seed` para crear el admin
2. Login con admin@paddle.com / admin123
3. Crea 4 jugadores
4. Crea un partido con esos jugadores
5. Lista los partidos para verificar

¡Listo! Ya puedes empezar a usar la API 🚀
