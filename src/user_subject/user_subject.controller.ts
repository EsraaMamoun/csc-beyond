import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserSubjectService } from './user_subject.service';
import { CreateUserSubjectDto } from './dto/create-user_subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user_subject.dto';
import { PrismaService } from 'src/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiHeaders } from 'src/decorators/headers.decorator';
import { CustomAuthGuard } from 'src/guards/auth.guard';
import { CurrentAccount } from 'src/decorators/account.decorator';
import { Account } from 'src/account/entities/account.entity';

@ApiHeaders({ withAuth: true })
@UseGuards(CustomAuthGuard)
@ApiTags('User Subject')
@Controller('user-subject')
export class UserSubjectController {
  constructor(
    private readonly userSubjectService: UserSubjectService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  create(@Body() createUserSubjectDto: CreateUserSubjectDto) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.create(createUserSubjectDto, prisma);
    });
  }

  @Get()
  findAll() {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.findAll(prisma);
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.findOne(+id, prisma);
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserSubjectDto: UpdateUserSubjectDto,
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.update(+id, updateUserSubjectDto, prisma);
    });
  }

  @Post('set-mark')
  updateUsingAccountSubjectIds(
    @Body() updateUserSubjectDto: UpdateUserSubjectDto,
  ) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.updateUsingAccountSubjectIds(
        updateUserSubjectDto,
        prisma,
      );
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.remove(+id, prisma);
    });
  }

  @Post('marks')
  theUserSubjectMarks(@CurrentAccount() account: Account) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.userSubjectMarks(account.id, prisma);
    });
  }

  @Get('marks/:account_id')
  userSubjects(@Param('account_id') account_id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.userSubjectMarks(+account_id, prisma);
    });
  }
}
