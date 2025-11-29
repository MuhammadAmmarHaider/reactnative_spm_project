import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { ProjectModule } from './project/project.module';
import { CategoryModule } from './category/category.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    EmailModule,
    ProjectModule,
    CategoryModule,
    ApplicationModule,
  ],
})
export class AppModule {}
