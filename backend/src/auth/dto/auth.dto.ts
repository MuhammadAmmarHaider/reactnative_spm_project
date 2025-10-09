import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class AuthDto  {

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;


}
