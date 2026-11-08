import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Inyectado previamente por JwtAuthGuard

    if (user && user.perfil === 'administrador') {
      return true;
    }
    
    throw new ForbiddenException('Acceso denegado: Se requiere rol de administrador');
  }
}