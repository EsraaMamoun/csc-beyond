import { PartialType } from '@nestjs/swagger';
import { CreateTokenDto } from './create-token.dto';

export class UpdateTokenDto extends PartialType(CreateTokenDto) {
  readonly access_token?: string;

  readonly refresh_token?: string;

  readonly temp_token?: string;
}
