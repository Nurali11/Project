<<<<<<< HEAD
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
=======
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
>>>>>>> 2d978fda3cbfda804bc7df6f95f75885dcbca574
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
<<<<<<< HEAD

  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean{
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers.authorization?.split(' ')?.[1];

    if(!token){
      throw new UnauthorizedException('Token not provided')
    }

    try {
      
      let data = this.jwt.verify(token)
      req['user'] = {
        id: data['id'],
        role: data['role']
      }
      console.log(req['user']);  
    } catch (error) {
      return false;
    }
    return true;
=======
  constructor(private readonly jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided!');
    }
    try {
      let data = this.jwt.verify(token, { secret: 'accessSecret' });
      request['user'] = data.id;
      request['role'] = data.role;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token!');
    }
>>>>>>> 2d978fda3cbfda804bc7df6f95f75885dcbca574
  }
}
