import { UserService } from '../../user/services/user.service';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { JwtService } from '@nestjs/jwt';
import { pick, isNil } from 'lodash';
import { Controller, Post, Body, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { LoginGoogleParams } from '../validators/auth.validator';
import { ConfigService } from '@nestjs/config';

interface IUser {
  email: string;
  password: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

const autheticatedUserFields = ['id', 'email'];

@Controller('api/v1/auth')
export class AuthController {
  constructor(private userService: UserService, private response: ApiResponseService, private jwtService: JwtService, private config: ConfigService) {}

  @Post('login/google')
  async googleAuthCallback(@Body() body: LoginGoogleParams): Promise<any> {
    const client = new OAuth2Client(this.config.get('GOOGLE_CONSUMER_KEY'));
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: body.idToken,
      });
    } catch (e) {
      throw new BadRequestException('Token is not valid');
    }
    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestException('can not paraser idToken');
    }
    const email: string = payload.email;
    if (isNil(email) || email === '') {
      throw new BadRequestException('Can not get email address');
    }
    let user = await this.userService.first({ where: { email } });
    if (!user) {
      user = await this.userService.create({
        email: this.userService.sanitizeEmail(email),
        first_name: payload.given_name,
        last_name: payload.family_name,
      });
    }
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, autheticatedUserFields)),
    });
  }

  @Post('/register')
  async register(@Body() data: IUser): Promise<any> {
    const { email, password } = data;
    if (await this.userService.isExisting(email)) {
      throw new ConflictException('Email already exist');
    }
    const user = await this.userService.create({
      ...pick(data, ['email', 'password', 'first_name', 'last_name']),
      ...{
        password: this.userService.hashPassword(password),
        email: this.userService.sanitizeEmail(email),
      },
    });
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, autheticatedUserFields)),
    });
  }

  @Post('/login')
  async login(@Body() data: IUserLogin): Promise<any> {
    const { email, password } = data;
    const user = await this.userService.first({
      where: {
        email: this.userService.sanitizeEmail(email),
      },
      select: [...autheticatedUserFields, 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = this.userService.checkPassword(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Password does not match');
    }
    return this.response.primitive({
      token: this.jwtService.sign(pick(user, autheticatedUserFields)),
    });
  }
}
