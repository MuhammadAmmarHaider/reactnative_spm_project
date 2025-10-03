import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
  constructor(config: ConfigService,private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET') || 'super-secret',
    });
  }

  async validate(payload: {sub: number}) {
    // updated code
    const user = await this.prisma.user.findUnique({
        where:{id:payload.sub}
    });
    if(!user) return null;
    delete (user as any).passwordHash;
    return user;
  }
}