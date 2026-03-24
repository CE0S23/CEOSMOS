import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { randomBytes } from 'crypto';

const rpID = process.env.RP_ID || 'localhost';
const expectedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) throw new BadRequestException('Email or username already in use');

    let passwordHash = null;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 12);
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        passwordHash,
      },
    });

    const code = randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    await this.prisma.emailToken.create({
      data: {
        userId: user.id,
        code,
        type: 'VERIFY_EMAIL',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    });
    await this.mailService.sendVerificationEmail(user.email, code);

    return { message: 'User created. Please check email for verification.' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash || !user.emailVerified) {
      throw new UnauthorizedException('Invalid credentials or email not verified');
    }
    const isValid = await bcrypt.compare(dto.password || '', user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    return this.createSession(user.id);
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const token = await this.prisma.emailToken.findFirst({
      where: {
        userId: user.id,
        type: 'VERIFY_EMAIL',
        used: false,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!token) throw new BadRequestException('Invalid or expired code');

    await this.prisma.emailToken.update({ where: { id: token.id }, data: { used: true } });
    await this.prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });

    return { message: 'Email verified successfully' };
  }

  async generateWebAuthnRegisterOptions(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const passkeys = await this.prisma.passkey.findMany({ where: { userId: user.id } });
    const options = await generateRegistrationOptions({
      rpName: 'CEOSMOS',
      rpID,
      userID: new Uint8Array(Buffer.from(user.id)),
      userName: user.email,
      userAgent: 'user_agent_here',
      excludeCredentials: passkeys.map(p => ({
        id: new Uint8Array(Buffer.from(p.credentialId, 'base64url')),
        type: 'public-key',
      })),
      authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
    });

    return options; // To send to frontend, usually save challenge in session too
  }

  async verifyWebAuthnRegister(email: string, body: any, expectedChallenge: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException();

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp } =
        verification.registrationInfo;

      await this.prisma.passkey.create({
        data: {
          credentialId: Buffer.from(credentialID).toString('base64url'),
          userId: user.id,
          webAuthnUserId: Buffer.from(user.id).toString('base64url'),
          publicKey: Buffer.from(credentialPublicKey),
          counter: BigInt(counter),
          deviceType: credentialDeviceType,
          backedUp: credentialBackedUp,
          transports: body.response.transports || [],
        },
      });
      return { verified: true };
    }
    return { verified: false };
  }

  async generateWebAuthnLoginOptions(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    const passkeys = await this.prisma.passkey.findMany({ where: { userId: user.id } });

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: passkeys.map(p => ({
        id: new Uint8Array(Buffer.from(p.credentialId, 'base64url')),
        type: 'public-key',
      })),
      userVerification: 'preferred',
    });
    return options; // Needs to send back and save challenge temporarily
  }

  async verifyWebAuthnLogin(email: string, body: any, expectedChallenge: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const credentialID = body.id;
    const passkey = await this.prisma.passkey.findUnique({
      where: { credentialId: credentialID },
    });
    if (!passkey || passkey.userId !== user.id) throw new BadRequestException('Invalid credential');

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: {
        credentialPublicKey: new Uint8Array(passkey.publicKey),
        credentialID: new Uint8Array(Buffer.from(passkey.credentialId, 'base64url')),
        counter: Number(passkey.counter),
        transports: passkey.transports as any,
      },
      requireUserVerification: false,
    });

    if (verification.verified) {
      await this.prisma.passkey.update({
        where: { credentialId: passkey.credentialId },
        data: { counter: BigInt(verification.authenticationInfo.newCounter) },
      });
      return this.createSession(user.id);
    }
    return { verified: false };
  }

  async createSession(userId: string) {
    // End active sessions for single device usage if required
    await this.prisma.session.deleteMany({ where: { userId } });

    const token = randomBytes(32).toString('hex');
    const session = await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const jwt = this.jwtService.sign({ userId, sessionId: session.id });
    return { accessToken: jwt };
  }

  async logout(userId: string) {
    await this.prisma.session.deleteMany({ where: { userId } });
    return { message: 'Logged out successfully' };
  }
}
