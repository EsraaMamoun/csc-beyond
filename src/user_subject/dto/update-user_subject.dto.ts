import { PartialType } from '@nestjs/swagger';
import { CreateUserSubjectDto } from './create-user_subject.dto';

export class UpdateUserSubjectDto extends PartialType(CreateUserSubjectDto) {}
