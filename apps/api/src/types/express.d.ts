import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    /** UUID del usuario autenticado (JWT `sub`). */
    authUserId?: string;
    /** Código del rol del usuario extraído del token. */
    authUserRole?: string;
    /** Correo institucional del usuario extraído del token. */
    authUserEmail?: string;
  }
}
