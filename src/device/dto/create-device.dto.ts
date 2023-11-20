import { ApiProperty } from '@nestjs/swagger';
import { LanguageEnum } from 'src/enums/language.enum';
import { OSEnum } from 'src/enums/os.enum';

export class CreateDeviceDto {
  @ApiProperty()
  account_id?: number;

  @ApiProperty()
  language?: LanguageEnum;

  @ApiProperty()
  os?: OSEnum;

  @ApiProperty()
  ip?: string;

  @ApiProperty()
  is_deleted?: boolean;

  @ApiProperty()
  created_at?: Date;

  @ApiProperty()
  updated_at?: Date;
}
