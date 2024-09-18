import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly users: UserDto[] = [];

    public create(newUser: UserDto) {
        newUser.id = uuid();
        newUser.passwoard = bcryptHashSync(newUser.passwoard, 10);
        this.users.push(newUser);
        console.log(this.users);

    };

}
