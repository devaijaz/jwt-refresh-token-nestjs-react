import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AppService } from './app.service';
import { Roles } from './auth/guards/roles';
import { RolesGuard } from './auth/guards/roles.guard';
import { UserRole } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getHello(@Req() request: Request): string {
    return this.appService.getHello();
  }
}
