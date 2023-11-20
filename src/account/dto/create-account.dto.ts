import { ApiProperty } from '@nestjs/swagger';
import { AccountTypeEnum } from 'src/enums/account_type.enum';

export class CreateAccountDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  is_active?: boolean;

  @ApiProperty()
  account_type?: AccountTypeEnum;
}
