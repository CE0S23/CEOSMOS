# CEOSMOS Backend - NestJS + Prisma

El backend de CEOSMOS ha sido implementado desde cero siguiendo altos estándares de seguridad y modularidad usando NestJS.

## 📌 Checklist de Variables de Entorno
Para que el sistema funcione (tanto en local como en Railway), debes configurar las siguientes variables:

- `DATABASE_URL`: `postgresql://tu-usuario:tu-password@ep-green-hall-anvbwgw9.us-east-1.aws.neon.tech/neondb?sslmode=require`
- `PORT`: `3000` (Opcional, Railway lo inyectará automáticamente)
- `FRONTEND_ORIGIN`: `https://ceosmos.vercel.app` (Local: `http://localhost:4200`)
- `RP_ID`: `ceosmos.vercel.app` (Local: `localhost`. Clave para WebAuthn)
- `JWT_SECRET`: Texto seguro (Ej. `un_secreto_increiblemente_largo_y_dificil_ceosmos_2026!`)
- `GMAIL_USER`: `2023371167@uteq.edu.mx`
- `GMAIL_APP_PASSWORD`: Contraseña de aplicación generada desde la seguridad de tu cuenta Google (16 letras sin espacios). **Mándalas directo a las env vars de Railway**.

## 🚀 Endpoints de Usuarios y Perfil (Users Module)
Todas las rutas están prefijadas con `/api` y protegidas con **JwtAuthGuard** (requieren que el usuario haya hecho login y tenga el cookie `Authentication`).

### 1. Obtener Perfil Actual (`GET /api/users/me`)
Retorna los datos del usuario logueado en sesión, incluyendo sus preferencias, biblioteca de medios y llaves de acceso enmascaradas (sin el passwordHash).

### 2. Actualizar Perfil (`PATCH /api/users/profile`)
- **Body Request:**
  ```json
  {
    "username": "nuevo_nombre",
    "preferences": {
      "theme": "light",
      "flowTimeDefault": 45
    }
  }
  ```
- **Nota:** Valida automáticamente si el username o email ya están en uso por otros. Si mandas `preferences`, actualiza individualmente (o crea) los campos.

### 3. Solicitar Cambio de Contraseña (`POST /api/users/change-password-request`)
- Inicia el flujo seguro de cambio de contraseña.
- Emite un email con un enlace hacia tu frontend.
- **Acción del backend:** Crea un `Token` SHA-256 en la BBDD con exp de 1 hora y manda un email.

### 4. Confirmar Cambio de Contraseña (`POST /api/users/confirm-password-change`)
- **Body Request:**
  ```json
  {
    "token": "el_token_crudo_de_la_url",
    "newPassword": "mi_nueva_password_super_segura123"
  }
  ```
- **Nota:** Compara el hash SHA-256 del token, verifica que no esté caducado y re-encripta el nuevo password (Bcrypt coste 12).

### 5. Eliminar Cuenta (`DELETE /api/users/:id`)
Borra irreversiblemente la cuenta y (por el `onDelete: Cascade` en Prisma) elimina las contraseñas, meditecas, y preferencias asociadas. El `:id` de la ruta tiene que coincidir con el ID extraído de la cookie de quien hace la solicitud.

## 🛠 Comandos base para continuar desarrollando
- Iniciar Servidor: `npm run start:dev`
- Sincronizar BBDD: `npx prisma db push`
- Generar Tipos: `npx prisma generate`
