import { Document } from 'mongoose';
export type UsuarioDocument = Usuario & Document;
export declare class Usuario {
    nombre: string;
    apellido: string;
    email: string;
    username: string;
    password: string;
    fechaNacimiento: Date;
    descripcion: string;
    imagenPerfil: string;
    perfil: string;
    activo: boolean;
}
export declare const UsuarioSchema: import("mongoose").Schema<Usuario, import("mongoose").Model<Usuario, any, any, any, any, any, Usuario & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Usuario, Document<unknown, {}, Usuario, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    nombre?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    apellido?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    username?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    fechaNacimiento?: import("mongoose").SchemaDefinitionProperty<Date, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    descripcion?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    imagenPerfil?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    perfil?: import("mongoose").SchemaDefinitionProperty<string, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    activo?: import("mongoose").SchemaDefinitionProperty<boolean, Usuario, Document<unknown, {}, Usuario, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Usuario>;
