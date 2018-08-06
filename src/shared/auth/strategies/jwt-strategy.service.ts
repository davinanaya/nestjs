import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'shared/auth/auth.service';
import { ConfigurationService } from 'shared/configuration/configuration.service';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Configuration } from 'shared/configuration/configuration.enum';
import { JwtPayLoad } from 'shared/auth/jwt-payload';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy){
    constructor(
        private readonly _authService: AuthService,
        private readonly _configurationService: ConfigurationService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: _configurationService.get(Configuration.JWT_KEY)
        });
    }

    async validate(payload: JwtPayLoad, done: VerifiedCallback){
        const user = await this._authService.validatePayLoad(payload);

        if(!user){
            return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
        }

        return done(null, user, payload.iat);
    }
}
