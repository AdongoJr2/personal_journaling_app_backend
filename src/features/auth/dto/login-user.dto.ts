import { IsDefined } from 'class-validator';

export class LoginUserDto {
  /**
   * @example User1
   */
  @IsDefined({
    message: '$property is required',
  })
  username: string;

  /**
   * @example 123456
   */
  @IsDefined({
    message: '$property is required',
  })
  password: string;
}
