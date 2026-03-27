import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly from = 'CEOSMOS <ras3ec@gmail.com>';

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const html = `
      <div style="background-color: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 40px; text-align: center;">
        <h1 style="color: #58a6ff;">Verifica tu cuenta CEOSMOS</h1>
        <p style="font-size: 16px;">Usa el siguiente código para verificar tu cuenta en CEOSMOS:</p>
        <div style="margin: 30px auto; padding: 20px; background-color: #161b22; border-radius: 8px; border: 1px solid #30363d; display: inline-block;">
          <h2 style="font-size: 32px; letter-spacing: 4px; margin: 0; color: #fff;">${code}</h2>
        </div>
        <p style="font-size: 14px; color: #8b949e;">Este código expira en 15 minutos.</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Verifica tu cuenta CEOSMOS',
        html,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send verification email', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200';
    const resetLink = `${origin}/reset-password?token=${encodeURIComponent(token)}`;

    const html = `
      <div style="background-color: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 40px; text-align: center;">
        <h1 style="color: #58a6ff;">Restablece tu contraseña CEOSMOS</h1>
        <p style="font-size: 16px;">Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo:</p>
        <div style="margin: 30px auto;">
          <a href="${resetLink}" style="background-color: #238636; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="font-size: 14px; color: #8b949e;">Este enlace expira en 1 hora.</p>
        <p style="font-size: 12px; color: #8b949e;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><br>${resetLink}</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Restablece tu contraseña CEOSMOS',
        html,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send password reset email', error);
      throw error;
    }
  }

  async sendPasswordChangeConfirmEmail(email: string, token: string): Promise<void> {
    const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200';
    const confirmLink = `${origin}/confirm-password-change?token=${encodeURIComponent(token)}`;

    const html = `
      <div style="background-color: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 40px; text-align: center;">
        <h1 style="color: #58a6ff;">Confirma tu cambio de contraseña</h1>
        <p style="font-size: 16px;">Se ha solicitado un cambio de contraseña desde tu perfil. Haz clic en el enlace para confirmar:</p>
        <div style="margin: 30px auto;">
          <a href="${confirmLink}" style="background-color: #238636; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Confirmar Cambio de Contraseña
          </a>
        </div>
        <p style="font-size: 14px; color: #8b949e;">Este enlace expira en 1 hora.</p>
        <p style="font-size: 12px; color: #8b949e;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><br>${confirmLink}</p>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: this.from,
        to: email,
        subject: 'Confirma tu cambio de contraseña',
        html,
      });
      this.logger.log(`Password change confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send password change confirmation email', error);
      throw error;
    }
  }
}
