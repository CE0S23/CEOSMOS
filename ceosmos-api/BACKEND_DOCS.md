# CEOSMOS Backend - NestJS + Prisma

El backend de CEOSMOS ha sido implementado desde cero siguiendo altos estándares de seguridad y modularidad usando NestJS.

## 📌 Checklist de Variables de Entorno
Para que el sistema funcione (tanto en local como en Railway), debes configurar las siguientes variables:

- `DATABASE_URL`: `postgresql://tu-usuario:tu-password@ep-green-hall-anvbwgw9.us-east-1.aws.neon.tech/neondb?sslmode=require`
- `PORT`: `8080` (Opcional, Railway lo inyectará automáticamente. Default local: **8080**)
- `FRONTEND_ORIGIN`: `https://ceosmos.vercel.app` (Local: `http://localhost:4200`)
- `RP_ID`: `ceosmos.vercel.app` (Local: `localhost`. Clave para WebAuthn)
- `JWT_SECRET`: Texto seguro (Ej. `un_secreto_increiblemente_largo_y_dificil_ceosmos_2026!`)
- `GMAIL_USER`: `2023371167@uteq.edu.mx`
- `GMAIL_APP_PASSWORD`: Contraseña de aplicación generada desde la seguridad de tu cuenta Google (16 letras sin espacios). **Mándalas directo a las env vars de Railway**.

## 🚀 Endpoints de Usuarios y Perfil (Users Module)
Todas las rutas están prefijadas con `/api` y protegidas con **JwtAuthGuard** (requieren que el usuario haya hecho login y tenga el cookie `Authentication`).

### 1. Obtener Perfil Actual (`GET /api/users/me`)
Retorna los datos del usuario logueado en sesión, incluyendo sus preferencias, biblioteca de medios y llaves de acceso enmascaradas (sin el passwordHash).

### 2. Actualizar Preferencias (`PATCH /api/users/preferences`)
- **Body Request:**
  ```json
  {
    "theme": "dark",
    "flowTimeDefault": 60
  }
  ```

### 3. Actualizar Perfil (`PATCH /api/users/profile`)
- **Body Request:**
  ```json
  {
    "username": "nuevo_nombre"
  }
  ```
- **Nota:** Valida automáticamente si el username ya está en uso por otro usuario.

### 4. Eliminar Cuenta Propia (`DELETE /api/users/me`)
Borra irreversiblemente la cuenta del usuario autenticado y (por el `onDelete: Cascade` en Prisma) elimina las preferencias, mediaItems, sessions y emailTokens asociados.

---

## 🔐 Endpoints Exclusivos de ADMIN (Role-Based Access Control)
Estas rutas requieren que el usuario tenga `role = ADMIN`. Están protegidas con `JwtAuthGuard` + `RolesGuard`.

### 5. Listar todos los usuarios (`GET /api/users`)
Retorna todos los usuarios registrados, ordenados por fecha de creación (más recientes primero). Incluye `mediaItemsCount`.

### 6. Eliminar usuario por ID (`DELETE /api/users/:id`)
- **Params:** `:id` — UUID del usuario a eliminar.
- **Restricción:** Un admin no puede eliminarse a sí mismo con este endpoint (usar `DELETE /api/users/me`).
- **Respuesta:** `{ message: "User <email> deleted successfully" }`

### 7. Cambiar rol de usuario (`PATCH /api/users/:id/role`)
- **Params:** `:id` — UUID del usuario a modificar.
- **Body Request:**
  ```json
  { "role": "ADMIN" }
  ```
  Valores válidos: `"USER"` | `"ADMIN"`
- **Restricción:** Un admin no puede cambiar su propio rol con este endpoint.
- **Respuesta:** `{ id, email, role }`

---

## 🛠 Comandos base para continuar desarrollando
- Iniciar Servidor: `npm run start:dev` (Puerto: **8080**)
- Sincronizar BBDD: `npx prisma db push`
- Generar Tipos: `npx prisma generate`
