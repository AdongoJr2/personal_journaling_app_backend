import { IsDefined, MinLength } from 'class-validator';
import { UserBaseDto } from './user-base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends UserBaseDto {
  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 'person@example.com',
  })
  email: string;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: '+254700000000',
  })
  phoneNumber: string;

  @MinLength(6, {
    message: '$property must be at least $constraint1 characters long',
  })
  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: '123456',
  })
  password: string;
}
