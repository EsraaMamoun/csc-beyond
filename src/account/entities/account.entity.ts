import { AccountTypeEnum } from 'src/enums/account_type.enum';

export class Account {
  id: number;

  username: string;

  email: string;

  password: string;

  is_active: boolean;

  account_type: AccountTypeEnum;

  created_at: Date;

  updated_at: Date;
}

export class AccountFilter {
  id?: number;

  username?: string;

  email?: string;

  password?: string;

  is_active?: boolean;

  account_type?: AccountTypeEnum;

  created_at?: Date;

  updated_at?: Date;
}
