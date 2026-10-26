// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'SUPER_SECRETO_CAMBIAR_EN_PRODUCCION', // Debe coincidir con la clave secreta del JwtModule
//     });
//   }

//   async validate(payload: any) {
//     // Lo que retornes aquí se inyectará automáticamente en request.user
//     // payload contiene: { sub: id, identificador: email, perfil: rol }
//     return { 
//       userId: payload.sub, 
//       email: payload.identificador, 
//       perfil: payload.perfil 
//     };
//   }
// }