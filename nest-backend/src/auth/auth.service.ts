import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SignupSuccessDTO } from './dto/signup-success.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async createUser(signupDto: SignupDto) {
    const { email, fullname, password } = signupDto;
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.userRepository.create({
        email,
        fullname,
        password: hashedPassword,
      });
      const userCreated = await this.userRepository.save(user);
      return SignupSuccessDTO.convert(userCreated);
    } catch (error) {
      if (error.code == '23505') {
        throw new ConflictException(
          `Email "${email}" already in use, try another.`,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async authenticate({ email, password }: LoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new BadRequestException('Invalid username/password');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneOrFail({ where: { email } });
  }
}
