import { Controller, Get, UseGuards, Post, Request, Body, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { ApiOperation, ApiCreatedResponse, ApiBody, ApiBearerAuth, ApiProperty, ApiOkResponse } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AuthService } from './auth/auth.service';
import { APIHttpExceptionFilter } from './http-exception.filter';


/**
 * Describe login to swagger
 */
export class LoginDetails {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  readonly password: string;
}


/**
 * Describe login to swagger
 */
export class UserDetails {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  readonly displayName: string;

  @ApiProperty()
  readonly publicId: string;
}


/**
 * Login reply.
 */
export class AuthInfo {
  @ApiProperty({ description: 'JWT token' })
  readonly accessToken: string;

  @ApiProperty({ description: 'Logged in user info' })
  readonly userDetails: UserDetails;
}


@Controller()
@UseFilters(new APIHttpExceptionFilter())  // Nice error handling
export class AppController {

  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Fullstack hiring exercise backend';
  }

  @ApiOperation({ summary: "Log in a user and return session JWT token" })
  @ApiOkResponse({ description: 'Received session token',})
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() data: LoginDetails): Promise<AuthInfo> {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: "Called on app reload to get the information of currenty logged in user" })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('userInfo')
  getUserInfo(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
