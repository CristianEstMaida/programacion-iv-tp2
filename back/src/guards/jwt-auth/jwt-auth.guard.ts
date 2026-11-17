import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()

export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: any) {
    // Si hubo un error o no encontró un usuario válido a través del token
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Tu sesión ha expirado. Por favor, volvé a iniciar sesión.',
        motivo: 'Token inválido o expirado.'
      });
    }
    return user;
  }
}
