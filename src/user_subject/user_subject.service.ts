import { Injectable } from '@nestjs/common';
import { CreateUserSubjectDto } from './dto/create-user_subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user_subject.dto';
import { Prisma } from '@prisma/client';
import { UserSubjectFilter } from './entities/user_subject.entity';

@Injectable()
export class UserSubjectService {
  create(
    createUserSubjectDto: CreateUserSubjectDto,
    prisma: Prisma.TransactionClient,
  ) {
    return prisma.user_subject.create({
      data: { ...createUserSubjectDto },
    });
  }

  async findAll(prisma: Prisma.TransactionClient) {
    return prisma.user_subject.findMany({
      where: { is_deleted: false },
    });
  }

  async findOne(id: number, prisma: Prisma.TransactionClient) {
    return prisma.user_subject.findFirst({
      where: { id },
    });
  }

  async update(
    id: number,
    updateAccountDto: UpdateUserSubjectDto,
    prisma: Prisma.TransactionClient,
  ) {
    return prisma.user_subject.update({
      where: { id },
      data: { ...updateAccountDto },
    });
  }

  async remove(id: number, prisma: Prisma.TransactionClient) {
    await prisma.user_subject.update({
      where: { id },
      data: { is_deleted: true },
    });

    return true;
  }
}
