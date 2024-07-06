import { IsMobilePhone, ValidationArguments } from 'class-validator';

export abstract class UserPhoneNumberDto {
  @IsMobilePhone(
    'en-KE',
    {},
    {
      message: (args: ValidationArguments) => {
        if (args.value !== undefined && args.value !== null) {
          if (args.value.length === 0) {
            return '$property cannot be empty';
          }

          return '$value is not a valid Kenyan mobile phone number';
        }

        return '$property should be valid Kenyan mobile phone number';
      },
    },
  )
  phoneNumber: string;
}
