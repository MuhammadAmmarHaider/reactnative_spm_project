import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import type { User } from '../../generated/prisma';
import { EditUserDto } from './dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Patch('me')
    updateUser(@GetUser('id') userId:number,@Body() dto:EditUserDto) {
        return this.userService.updateUser(userId,dto);
    }

    @Get('me')
    getMe(@GetUser() user: User,@GetUser('email') email:string) {
        console.log('user email is ',email);
        return user;
    }
}
