import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Prisma } from '@prisma/client';
import { SubjectFilter } from './entities/subject.entity';

@Injectable()
export class SubjectService {
  create(createSubjectDto: CreateSubjectDto, prisma: Prisma.TransactionClient) {
    return prisma.subject.create({
      data: { ...createSubjectDto },
    });
  }

  async findAll(prisma: Prisma.TransactionClient) {
    return prisma.subject.findMany({
      where: {
        is_deleted: false,
      },
    });
  }

  async findOne(id: number, prisma: Prisma.TransactionClient) {
    return prisma.subject.findFirst({
      where: { id },
    });
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
    prisma: Prisma.TransactionClient,
  ) {
    return prisma.subject.update({
      where: { id },
      data: { ...updateSubjectDto },
    });
  }

  async remove(id: number, prisma: Prisma.TransactionClient) {
    await prisma.subject.update({
      where: { id },
      data: { is_deleted: true },
    });

    return true;
  }
}
