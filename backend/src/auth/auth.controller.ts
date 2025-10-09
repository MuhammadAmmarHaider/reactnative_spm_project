import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResendOtpDto, SignupDto, TwoFactorCodeDto, VerifyEmailDto } from './dto';
import { JwtGuard, Jwt2faGuard } from './guard';
import { EmailInUseDto } from './dto/email.in.user.dto';
import { SignInDto } from './dto/signin.dto';
import { FetchUserDataDto } from './dto/fetch.user.data.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(@Body() dto: SignInDto) {
        return this.authService.signin(dto);
    }

    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('my')
    async fetchUserDataAfterSignIn(@Req() req: any) {
        const data = req.user;
        return {
            firstName: data?.firstName,
            lastName: data?.lastName,
            phoneNumber: data?.phoneNumber,
            email: data?.email,
            role: 'user',
        };
    }



    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto.email, dto.otp);
    }


    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    resendOtp(@Body() dto: ResendOtpDto) {
        return this.authService.resendVerificationOtp(dto.email);
    }

    @Post('2fa/generate')
    @UseGuards(JwtGuard)
    async generate2faQrCode(@Req() req) {
        const { otpauthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(req.user);

        return {
            qrCode: await this.authService.generateQrCodeDataUrl(otpauthUrl),
        };
    }

    @Post('2fa/turn-on')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtGuard)
    async turnOnTwoFactorAuthentication(
        @Req() req,
        @Body() { twoFactorAuthenticationCode }: TwoFactorCodeDto,
    ) {
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
            twoFactorAuthenticationCode,
            req.user,
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        await this.authService.turnOnTwoFactorAuthentication(req.user.id);

        return {
            message: '2FA has been enabled successfully',
        };
    }

    @Post('2fa/authenticate')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtGuard)
    async authenticate(
        @Req() req,
        @Body() { twoFactorAuthenticationCode }: TwoFactorCodeDto,
    ) {
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
            twoFactorAuthenticationCode,
            req.user,
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        return this.authService.loginWith2fa(req.user);
    }

    @Post('2fa/turn-off')
    @HttpCode(HttpStatus.OK)
    @UseGuards(Jwt2faGuard)
    async turnOffTwoFactorAuthentication(@Req() req) {
        await this.authService.turnOffTwoFactorAuthentication(req.user.id);

        return {
            message: '2FA has been disabled',
        };
    }


    @Post('email')
    @HttpCode(HttpStatus.OK)
    async isEmailInUse(@Body() dto: EmailInUseDto) {
        const available = await this.authService.isEmailInUse(dto.email)
        return { available }
    }

}
