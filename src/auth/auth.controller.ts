import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './schemas/user.model';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR } from './auth.contants';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(UserModel.name) private authModel: Model<UserModel>,
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { email } = await this.authService.validateUser(login, password);
    return this.authService.login(email);
  }
}
