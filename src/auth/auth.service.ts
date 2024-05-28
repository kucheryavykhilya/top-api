import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './schemas/user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { Model } from 'mongoose';
import {
  ALREADY_REGISTERED_ERROR,
  NOT_REGISTERED_ERROR,
  WRONG_PASSWORD,
} from './auth.contants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash,
    });
    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(NOT_REGISTERED_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return { email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
