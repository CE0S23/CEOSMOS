import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="privacidad container" aria-labelledby="priv-heading">
      <header class="priv-header">
        <h1 id="priv-heading">Politica de Privacidad</h1>
        <p class="updated">Ultima actualizacion: marzo 2026</p>
      </header>
      <section class="priv-section">
        <h2>1. Datos que recopilamos</h2>
        <p>CEOSmos recopila unicamente el identificador de perfil, nombre y correo electronico provistos por Google Identity Services o la llave publica de tu Passkey. No almacenamos contrasenas ni datos biometricos.</p>
      </section>
      <section class="priv-section">
        <h2>2. Uso de los datos</h2>
        <p>Los datos se usan exclusivamente para personalizar tu experiencia de Flow. No compartimos informacion personal con terceros con fines comerciales.</p>
      </section>
      <section class="priv-section">
        <h2>3. Seguridad</h2>
        <p>Toda comunicacion viaja cifrada mediante HTTPS/TLS. La autenticacion biometrica (Passkey/WebAuthn) se procesa localmente en tu dispositivo; la llave privada nunca abandona el hardware.</p>
      </section>
      <section class="priv-section">
        <h2>4. Tus derechos</h2>
        <p>Puedes solicitar la eliminacion de tus datos en cualquier momento cerrando sesion y contactando al administrador del sistema.</p>
      </section>
      <a routerLink="/home" class="back-link">Volver al inicio</a>
    </main>
  `,
  styles: [`
    .privacidad { max-width: 720px; padding: 60px 24px 80px; }
    .priv-header { margin-bottom: 40px; }
    h1 { font-family:'Space Grotesk',sans-serif; font-size:2rem; font-weight:700; background:linear-gradient(135deg,#667eea,#764ba2); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin:0 0 8px; }
    .updated { color:rgba(240,244,248,0.4); font-size:0.8rem; margin:0; }
    .priv-section { margin-bottom:32px; }
    h2 { font-size:1.1rem; font-weight:600; color:#c4b5fd; margin:0 0 12px; }
    p { color:rgba(240,244,248,0.65); line-height:1.7; font-size:0.9rem; margin:0; }
    .back-link { display:inline-block; margin-top:40px; color:#7b68ee; text-decoration:none; font-size:0.875rem; border-bottom:1px solid transparent; transition:border-color 0.2s; &:hover { border-bottom-color:#7b68ee; } }
  `],
})
export class PrivacidadComponent {}
