import { TokenTypeEnum } from 'src/enums/token_type.enum';

export class CreateTokenDto {
  token_data?: string;

  account_id: number;

  related_token_id?: number;

  token_type: TokenTypeEnum;

  expiry_date: Date;

  is_deleted?: boolean;

  created_at?: Date;

  updated_at?: Date;
}
