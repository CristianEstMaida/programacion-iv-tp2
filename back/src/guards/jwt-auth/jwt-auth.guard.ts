import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()

export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: any) {
    // Si hubo un error o no encontró un usuario válido a través del token
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Token inválido o expirado',
        motivo: 'Tu sesión ha expirado. Por favor, volvé a iniciar sesión.'
      });
    }
    return user;
  }
}
