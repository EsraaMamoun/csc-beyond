import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSubjectDto {
  @ApiProperty()
  subject_id: number;

  @ApiProperty()
  account_id: number;

  @ApiProperty()
  mark?: number;
}
