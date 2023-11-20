import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty()
  subject_name: string;

  @ApiProperty()
  minimum_mark: number;
}
