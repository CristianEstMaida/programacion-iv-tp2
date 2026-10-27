var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
let Usuario = class Usuario {
    nombre;
    apellido;
    email;
    username;
    password;
    fechaNacimiento;
    descripcion;
    imagenPerfil;
    perfil;
    activo;
};
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], Usuario.prototype, "apellido", void 0);
__decorate([
    Prop({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    Prop({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], Usuario.prototype, "username", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaNacimiento", void 0);
__decorate([
    Prop({ trim: true }),
    __metadata("design:type", String)
], Usuario.prototype, "descripcion", void 0);
__decorate([
    Prop({ trim: true }),
    __metadata("design:type", String)
], Usuario.prototype, "imagenPerfil", void 0);
__decorate([
    Prop({ required: true, enum: ['usuario', 'administrador'], default: 'usuario' }),
    __metadata("design:type", String)
], Usuario.prototype, "perfil", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "activo", void 0);
Usuario = __decorate([
    Schema({ timestamps: true })
], Usuario);
export { Usuario };
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
UsuarioSchema.pre('save', async function () {
    const usuario = this;
    if (!usuario.isModified('password')) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
    }
    catch (error) {
        throw error;
    }
});
//# sourceMappingURL=usuario.schema.js.map