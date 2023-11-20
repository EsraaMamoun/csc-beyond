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
import { UserSubjectFilter } from './entities/user_subject.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiHeaders } from 'src/decorators/headers.decorator';
import { CustomAuthGuard } from 'src/guards/auth.guard';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.userSubjectService.remove(+id, prisma);
    });
  }
}
