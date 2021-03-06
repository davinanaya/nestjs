import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { BaseService } from 'shared/base.service';
import { User } from 'user/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from 'shared/mapper/mapper.service';
import { RegisterVm } from 'user/models/view-models/register-vm.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { LoginVm } from 'user/models/view-models/login-vm.model';
import { LoginResponseVm } from 'user/models/view-models/login-response-vm.model';
import { JwtPayLoad } from 'shared/auth/jwt-payload';
import { AuthService } from 'shared/auth/auth.service';
import { UserVm } from 'user/models/view-models/user-vm.mode';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
        private readonly _mapperServices: MapperService,
        @Inject(forwardRef(() => AuthService))
        readonly _authService: AuthService
    ){
        super();
        this._model = _userModel;
        this._mapper = _mapperServices.mapper;
    }

    async register(registerVm: RegisterVm): Promise<User>{
        const {username, password, firstName, lastName } = registerVm;

        const newUser = new this._model(); //InstanceType<User>
        newUser.username = username;
        newUser.firstName = firstName;
        newUser.lastName = lastName;

        const salt = await genSalt(10);
        newUser.password = await hash(password, salt);

        try{
            const result = await this.create(newUser);
            return result.toJSON() as User;
        }catch(e){// mongo error
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async login(loginVm: LoginVm):Promise<LoginResponseVm>{
        const { username, password } = loginVm;

        const user = await this.findOne({username});
        if(!user){
            throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
        }

        const isMattch = await compare(password, user.password);

        if(!isMattch){
            throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
        }

        const payload: JwtPayLoad = {
            username: user.username,
            role: user.role
        }

        const token = await this._authService.signPayLoad(payload);
        const userVm: UserVm = await this.map<UserVm>(user.toJSON());

        return {
            token,
            user: userVm
        }
    }
}
