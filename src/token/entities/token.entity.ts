import { TokenTypeEnum } from 'src/enums/token_type.enum';

export class Token {
  id: number;

  token_data?: string;

  account_id: number;

  related_token_id?: number;

  token_type: TokenTypeEnum;

  expiry_date: Date;

  is_deleted: boolean;

  created_at: Date;

  updated_at?: Date;
}

export class TokenFilter {
  id?: number;

  token_data?: string;

  account_id?: number;

  related_token_id?: number;

  token_type?: TokenTypeEnum;

  expiry_date?: Date;

  is_deleted?: boolean;

  created_at?: Date;

  updated_at?: Date;
}

export class Tokens {
  access_token: string;
  refresh_token: string;
}

export class TokenReturn {
  result: boolean;

  tokens?: Tokens;
}
