import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userServices: UsersService) { }

    @Post()
    public create(@Body() user: UserDto) {
        this.userServices.create(user);
    }

}
