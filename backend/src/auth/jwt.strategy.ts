
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { jwtConstants } from './constants';



function parseAuthHeader(hdrValue) {
  var re = /(\S+)\s+(\S+)/;

  if (typeof hdrValue !== 'string') {
      return null;
  }
  var matches = hdrValue.match(re);
  return matches && { scheme: matches[1], value: matches[2] };
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /*
      jwtFromRequest: (request) => {
        var token = null;
        if (request.headers['authorization']) {
          var auth_params = parseAuthHeader(request.headers['authorization']);
          if (auth_params) {
            token = auth_params.value;
          }
        } else {
          Logger.debug('Bearer header missing')
        }
        Logger.debug(`Token is ${token}`);
        return token;
      },*/
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    Logger.log(`Validating JWT ${payload}`)
    return { userId: payload.sub, username: payload.username };
  }
}