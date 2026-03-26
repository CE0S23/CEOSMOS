import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

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
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verifica tu cuenta CEOSMOS',
        html,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(`Error sending verification email: ${e.message}`, e.stack);
      }
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const origin = this.configService.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:4200';
    const escapedToken = encodeURIComponent(token);
    const resetLink = `${origin}/reset-password?token=${escapedToken}`;
    
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
      await this.mailerService.sendMail({
        to: email,
        subject: 'Restablece tu contraseña CEOSMOS',
        html,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(`Error sending password reset email: ${e.message}`, e.stack);
      }
    }
  }
  async sendPasswordChangeConfirmEmail(email: string, token: string): Promise<void> {
    const origin = this.configService.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:4200';
    const escapedToken = encodeURIComponent(token);
    const resetLink = `${origin}/confirm-password-change?token=${escapedToken}`;
    
    const html = `
      <div style="background-color: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 40px; text-align: center;">
        <h1 style="color: #58a6ff;">Confirma tu cambio de contraseña</h1>
        <p style="font-size: 16px;">Se ha solicitado un cambio de contraseña desde tu perfil. Haz clic en el enlace para confirmar:</p>
        <div style="margin: 30px auto;">
          <a href="${resetLink}" style="background-color: #238636; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
            Confirmar Cambio de Contraseña
          </a>
        </div>
        <p style="font-size: 14px; color: #8b949e;">Este enlace expira en 1 hora.</p>
        <p style="font-size: 12px; color: #8b949e;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><br>${resetLink}</p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirma tu cambio de contraseña',
        html,
      });
      this.logger.log(`Password change confirmation email sent to ${email}`);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(`Error sending password change confirmation: ${e.message}`, e.stack);
      }
    }
  }

  async sendPasswordChangedNotificationEmail(email: string): Promise<void> {
    const html = `
      <div style="background-color: #0d1117; color: #c9d1d9; font-family: sans-serif; padding: 40px; text-align: center;">
        <h1 style="color: #58a6ff;">Contraseña Actualizada</h1>
        <p style="font-size: 16px;">Tu contraseña fue cambiada exitosamente.</p>
        <p style="font-size: 14px; color: #8b949e;">Si no fuiste tú, por favor contacta a soporte inmediatamente.</p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Tu contraseña fue cambiada exitosamente - CEOSMOS',
        html,
      });
      this.logger.log(`Password changed notification email sent to ${email}`);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(`Error sending password changed notification: ${e.message}`, e.stack);
      }
    }
  }
}
