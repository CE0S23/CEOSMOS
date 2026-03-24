import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"CEOSMOS" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta en CEOSMOS',
        html: `<h1>Bienvenido a CEOSMOS</h1>
               <p>Tu código de verificación de 6 dígitos es: <strong>${code}</strong></p>
               <p>Este código expira en 15 minutos.</p>`,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (e) {
      this.logger.error('Error sending verification email', e);
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${process.env.FRONTEND_ORIGIN}/reset-password?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: `"CEOSMOS" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de contraseña en CEOSMOS',
        html: `<h1>Recuperación de Contraseña</h1>
               <p>Has solicitado recuperar tu contraseña. Haz clic en el siguiente enlace:</p>
               <a href="${url}">Restablecer Contraseña</a>
               <p>Este enlace expira en 1 hora.</p>`,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (e) {
      this.logger.error('Error sending password reset email', e);
    }
  }

  async sendPasswordChangeConfirmEmail(email: string, token: string) {
    const url = `${process.env.FRONTEND_ORIGIN}/confirm-password-change?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: `"CEOSMOS" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Confirma tu cambio de contraseña',
        html: `<h1>Cambio de Contraseña</h1>
               <p>Se ha solicitado un cambio de contraseña desde tu perfil. Haz clic en el enlace para confirmar:</p>
               <a href="${url}">Confirmar Cambio de Contraseña</a>
               <p>Este enlace expira en 1 hora.</p>`,
      });
      this.logger.log(`Password change confirmation email sent to ${email}`);
    } catch (e) {
      this.logger.error('Error sending password change confirmation', e);
    }
  }
}
