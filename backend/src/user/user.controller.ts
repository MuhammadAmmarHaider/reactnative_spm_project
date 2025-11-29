import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import type { User } from '../../generated/prisma';
import { EditUserDto, UpdateProfileDto } from './dto';
import { Jwt2faGuard, JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Patch('me')
    updateUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.updateUser(userId, dto);
    }

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    // this endpoint requires full 2FA authentication
    @UseGuards(Jwt2faGuard)
    @Get('sensitive-data')
    getSensitiveData(@GetUser() user: User) {
        return {
            message: 'This is sensitive data',
            user,
        };
    }

    @UseGuards(Jwt2faGuard)
    @Patch('avatarUrl')
    async updateAvatarUrl(@GetUser('id') userId: number, @Body('avatarUrl') avatarUrl: string) {
        const updatedUser = await this.userService.updateAvatarUrl(userId, avatarUrl);

        return {
            avatarUrl: updatedUser.avatarUrl,
        };
    }
    @UseGuards(Jwt2faGuard)
    @Patch('profile')
    async updateProfile(@GetUser('id') userId: number, @Body() body: UpdateProfileDto) {
        const updatedUser = await this.userService.updateProfile(userId, body);
        return updatedUser;
    }
}
