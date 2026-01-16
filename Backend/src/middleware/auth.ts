
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_AUTH_SECRET} from "@utils/contants"
import { Response, NextFunction, RequestHandler } from 'express';
import { ERRORS, RequestError } from '@utils/error';
import { Request } from '@customTypes/connection';




export function decode(token: string): Promise<JwtPayload> {
  return new Promise(function(resolve, reject) {
      try {
        const dec =jwt.verify(token, JWT_AUTH_SECRET);
        if(typeof dec == 'string') {
          reject("We got an string as decoded");
          return;
        }
        resolve(dec);
      } catch(e) {
        reject(e)
      }
  })
}

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies?.access_token || req.headers["authorization"]?.split(' ')[1] as string;
  
  if (!token) {
    next(ERRORS.AUTH_NO_TOKEN_FOUND);
    return;
  }

  jwt.verify(token, JWT_AUTH_SECRET, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err || !decoded || typeof decoded === 'string') {
      next(ERRORS.AUTH_UNAUTHERISED);
      return;
    }
    
    req.user = {
      id: (decoded as any).id,
      org_id: (decoded as any).org_id,
      type: (decoded as any).type,
      is_admin: (decoded as any).is_admin,
      is_super_admin: (decoded as any).is_super_admin,
    };
    next();
  });
};

export const verifySuperAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers["authorization"]?.split(' ')[1] as string;
  
  if (!token) {
    next(ERRORS.AUTH_NO_TOKEN_FOUND);
    return;
  }

  jwt.verify(token, JWT_AUTH_SECRET, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err || !decoded || typeof decoded === 'string') {
      next(ERRORS.AUTH_UNAUTHERISED);
      return;
    }
    
    if (!(decoded as any).is_super_admin) {
      next(new RequestError('Only super admin can access this route', 10013, 403));
      return;
    }
    
    req.user = {
      id: (decoded as any).id,
      type: (decoded as any).type,
      is_super_admin: (decoded as any).is_super_admin,
    };
    next();
  });
};
