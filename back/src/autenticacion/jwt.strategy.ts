import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MI_CLAVE_SECRETA_SUPER_SEGURA', // Asegurate de que coincida con la que usas para firmar el token
    });
  }

  async validate(payload: any) {
    // ESTO ES LO CLAVE: Lo que retorne acá se guarda en req.user
    console.log("¡ENTRÓ A LA ESTRATEGIA JWT! Payload:", payload);
    return { 
      id: payload.sub,
      identificador: payload.identificador,
      perfil: payload.perfil,
    };
  }

  handleRequest(err: any, user: any, info: any) {
    // Si hubo un error, no hay usuario, o el token expiró/es inválido
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('La sesión ha expirado. Por favor, vuelva a iniciar sesión.');
      }
      throw new UnauthorizedException('Acceso no autorizado. Token inválido o ausente.');
    }
    return user;
  }
}