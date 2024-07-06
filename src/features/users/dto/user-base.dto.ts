import { IsEmail, ValidationArguments, IsDefined } from 'class-validator';
import { UserPhoneNumberDto } from './user-phone-number.dto';
import { ApiProperty } from '@nestjs/swagger';

export abstract class UserBaseDto extends UserPhoneNumberDto {
  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 'Sample',
  })
  firstName: string;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 'User',
  })
  lastName: string;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 'SampleUser',
  })
  username: string;

  @IsEmail(undefined, {
    message: (args: ValidationArguments) => {
      if (args.value !== undefined && args.value !== null) {
        return 'the $property provided is invalid';
      }

      return 'provide a valid email address';
    },
  })
  email: string;
}
