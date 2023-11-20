import { Module } from '@nestjs/common';
import { UserSubjectService } from './user_subject.service';
import { UserSubjectController } from './user_subject.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserSubjectController],
  providers: [UserSubjectService, PrismaService],
})
export class UserSubjectModule {}
