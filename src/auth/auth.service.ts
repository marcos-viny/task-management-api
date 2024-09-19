import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    private jwtExpirationTimeSeconds: number;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.jwtExpirationTimeSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME');
    }

    public signIn(username: string, password: string): AuthResponseDto {
        const foundUser = this.usersService.findByUserName(username);

        if (!foundUser || !bcryptCompareSync(password, foundUser.password)) {
            throw new UnauthorizedException();
        }

        const payload = { sub: foundUser.id, username: foundUser.userName };

        const token = this.jwtService.sign(payload);

        return { token, expireIn: this.jwtExpirationTimeSeconds }

    };

}
