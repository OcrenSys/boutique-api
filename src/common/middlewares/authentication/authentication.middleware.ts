import { Injectable, NestMiddleware } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Request, Response } from 'express';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { UsersService } from '../../../api/users/users.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;

  constructor(
    private authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {
    this.auth = authenticationService.getAuth();
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;

    if (token != undefined && token != null && token != '') { 
      const cleanToken: string = token.replace('Bearer ', '');
      this.auth
        .verifyIdToken(cleanToken)
        .then(async (firebaseUser) => {
          const { data } = await this.usersService.findOne(
            firebaseUser?.user_id || firebaseUser?.sub,
          );

          req['data'] = { ...data, firebaseUser };

          next();
        })
        .catch(() => {
          AuthenticationMiddleware.accessDenied(req.url, res);
        });
    } else {
      AuthenticationMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      status: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Acceso deneado, iniciar sesion para continuar.',
    });
  }
}
