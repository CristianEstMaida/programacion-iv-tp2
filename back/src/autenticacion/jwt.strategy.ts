import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

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
    // 🔍 ESTO ES LO CLAVE: Lo que retornes acá se guarda en req.user
    // Si tu token guarda el ID en 'sub', 'id' o '_id', mapealo acá:
    console.log("¡ENTRÓ A LA ESTRATEGIA JWT! Payload:", payload);
    return { 
      id: payload.sub,
      identificador: payload.identificador,
      perfil: payload.perfil,
    };
  }
}