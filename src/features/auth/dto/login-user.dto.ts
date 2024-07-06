import { IsDefined } from 'class-validator';
import { UserPhoneNumberDto } from 'src/features/users/dto/user-phone-number.dto';

export class LoginUserDto extends UserPhoneNumberDto {
  /**
   * @example +254700000000
   */
  @IsDefined({
    message: '$property is required',
  })
  phoneNumber: string;

  /**
   * @example 123456
   */
  @IsDefined({
    message: '$property is required',
  })
  password: string;
}
