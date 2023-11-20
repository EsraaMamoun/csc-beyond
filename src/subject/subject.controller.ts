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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma.service';
import { SubjectFilter } from './entities/subject.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiHeaders } from 'src/decorators/headers.decorator';
import { CustomAuthGuard } from 'src/guards/auth.guard';

@ApiTags('Subject')
// @ApiHeaders({ withAuth: true })
// @UseGuards(CustomAuthGuard)
@Controller('subject')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.subjectService.create(createSubjectDto, prisma);
    });
  }

  @Get()
  findAll() {
    return this.prismaService.$transaction(async (prisma) => {
      return this.subjectService.findAll(prisma);
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.subjectService.findOne(+id, prisma);
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.subjectService.update(+id, updateSubjectDto, prisma);
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.subjectService.remove(+id, prisma);
    });
  }
}
