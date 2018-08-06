import { Injectable } from '@nestjs/common';
import { BaseService } from 'shared/base.service';
import { User } from 'user/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from 'shared/mapper/mapper.service';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
        private readonly _mapperServices: MapperService
    ){
        super();
        this._model = _userModel;
        this._mapper = _mapperServices.mapper;
    }
}
