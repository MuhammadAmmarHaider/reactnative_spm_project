import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from 'generated/prisma/client';
import { authenticator } from 'otplib';
import { UserService } from '../user/user.service';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService, private userService: UserService) { }

    async generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(
            user.email,
            this.config.get('TWO_FACTOR_AUTHENTICATION_APP_NAME') || 'MyApp',
            secret);
        await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
        return { secret, otpauthUrl };
    }
    async generateQrCodeDataUrl(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        if (!user.twoFactorAuthenticationSecret) {
            return false;
        }

        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        });
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isTwoFactorAuthenticationEnabled: true },
        });
    }


    async turnOffTwoFactorAuthentication(userId: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isTwoFactorAuthenticationEnabled: false,
                twoFactorAuthenticationSecret: null,
            },
        });
    }

    async loginWith2fa(user: User) {
        return this.signToken(
            user.id,
            user.email,
            user.isTwoFactorAuthenticationEnabled,
            true // Now 2FA authenticated
        );
    }

    async signup(dto: AuthDto) {
        try {
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash: hash,
                }
            });
            return this.signToken(user.id, user.email, false, false);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // this error code is for the unique constraint violation
                    throw new ForbiddenException('Email already exists');
                }
            }
            throw error;
        }
    }
    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) throw new ForbiddenException('User does not exist');
        const isMatch = await argon.verify(user.passwordHash, dto.password);
        if (!isMatch) throw new ForbiddenException('Invalid password');
        return this.signToken(user.id, user.email, user.isTwoFactorAuthenticationEnabled, false);
    }
    async signToken(
        userId: number,
        email: string,
        isTwoFactorAuthenticationEnabled: boolean,
        isTwoFactorAuthenticated: boolean
    ): Promise<{ access_token: string; isTwoFactorAuthenticationEnabled?: boolean }> {
        const payload = {
            sub: userId,
            email,
            isTwoFactorAuthenticationEnabled,
            isTwoFactorAuthenticated,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1h',
            secret: secret,
        });
        return {
            access_token: token,
            isTwoFactorAuthenticationEnabled,
        };
    }


    async isEmailInUse(email: string): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: { email },
            select: { id: true },
        });
        return !!user;
    }
}
