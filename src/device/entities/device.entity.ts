import { LanguageEnum } from 'src/enums/language.enum';
import { OSEnum } from 'src/enums/os.enum';

export class Device {
  id: number;

  account_id?: number;

  language?: LanguageEnum;

  os?: OSEnum;

  ip?: string;

  is_deleted?: boolean;

  created_at?: Date;

  updated_at?: Date;
}

export class DeviceFilter {
  id?: number;

  account_id?: number;

  language?: LanguageEnum;

  os?: OSEnum;

  ip?: string;

  is_deleted?: boolean;

  created_at?: Date;

  updated_at?: Date;
}
