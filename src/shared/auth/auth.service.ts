import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { SignOptions, sign } from 'jsonwebtoken';
import { UserService } from 'user/user.service';
import { ConfigurationService } from 'shared/configuration/configuration.service';
import { Configuration } from 'shared/configuration/configuration.enum';
import { JwtPayLoad } from 'shared/auth/jwt-payload';
import { InstanceType } from 'typegoose';
import { User } from 'user/models/user.model';

@Injectable()
export class AuthService {
    private readonly jwtOptions: SignOptions;
    private readonly jwtKey: string;

    constructor(
        @Inject(forwardRef(() => UserService))
        readonly _userService: UserService,
        private readonly _configurationService: ConfigurationService
    ){
        this.jwtOptions = { expiresIn: '12h' };
        this.jwtKey = _configurationService.get(Configuration.JWT_KEY);
    }

    async signPayLoad(payload: JwtPayLoad): Promise<string>{
        return sign(payload, this.jwtKey, this.jwtOptions);
    }
    async validatePayLoad(payload: JwtPayLoad): Promise<InstanceType<User>>{
        return this._userService.findOne({ username: payload.username.toLowerCase() });
    }
}
