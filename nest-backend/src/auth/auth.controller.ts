import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Request, Response } from 'express';
import { JwtPayload } from '../types';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth.entity';
import { GetUser } from '../decorators/get-user';
import { ConfigService } from '@nestjs/config';
import { userInfo } from 'os';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  @Post('/signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.createUser(signupDto);
  }

  @Post('/signin')
  async signIn(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = await this.authService.authenticate(loginDto);

    const access_token = this.addTokenToHeader(user, response);
    if (true || request.xhr) {
      this.addCookieToResponse(user, response);
    }
    response.send({
      access_token,
      email: user.email,
      fullname: user.fullname,
    });
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  profile(@GetUser() user: User) {
    return new User({ ...user });
  }

  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    this.deleteRefreshTokenCookie(response);
    response.status(200).send();
  }
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    if (request.cookies['refresh_token']) {
      const refresh_token = request.cookies['refresh_token'];
      try {
        const data = await this.jwtService.verifyAsync(refresh_token, {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        });
        const user: User = await this.authService.getUserByEmail(data.email);
        this.addCookieToResponse(user, response);
        const access_token = this.addTokenToHeader(user, response);
        response.send({
          access_token,
          email: user.email,
          fullname: user.fullname,
        });
      } catch (e) {
        this.deleteRefreshTokenCookie(response);
        response.status(403).send();
      }
    }
    response.status(403).send();
  }
  deleteRefreshTokenCookie(response: Response) {
    response.cookie('refresh_token', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
      sameSite: 'none',
      secure: true,
    });
  }
  addCookieToResponse(user: User, response: Response) {
    const { email, fullname } = user;
    const rt_payload: JwtPayload = { email, fullname };
    const refresh_token = this.jwtService.sign(rt_payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '30d',
      algorithm: 'HS512',
    });
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      expires: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30),
      path: '/',
      sameSite: 'none',
      secure: true,
    });
  }
  addTokenToHeader(user: User, response: Response) {
    const { email } = user;
    const at_payload: JwtPayload = { email };

    const access_token = this.jwtService.sign(at_payload, {
      expiresIn: '5s',
    });
    response.setHeader('access_token', access_token);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    return access_token;
  }
}
