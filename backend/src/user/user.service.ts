import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    updateUser(userId:number,dto: EditUserDto) {
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
}
