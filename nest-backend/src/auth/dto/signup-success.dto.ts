import { User } from '../auth.entity';

export class SignupSuccessDTO {
  private message: string;
  private constructor(private email: string, private fullname: string) {
    this.message = 'Signup success!';
  }
  static convert(user: User) {
    return new SignupSuccessDTO(user.email, user.fullname);
  }
}
