import { Injectable } from '@nestjs/common';
import { EditUserDto, UpdateProfileDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorAuthenticationSecret: secret },
        });
    }

    findOne(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    findById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    updateUser(userId: number, dto: EditUserDto) {
        const user = this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        delete (user as any).passwordHash;
        return user;
    }

    async updateAvatarUrl(userId: number, avatarUrl: string): Promise<User> {
        return await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: avatarUrl },
        });
    }
    
    async updateProfile(userId: number, updates: UpdateProfileDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: updates,
            select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                email: true
            }
        });
    }
}
