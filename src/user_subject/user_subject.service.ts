import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserSubjectDto } from './dto/create-user_subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user_subject.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserSubjectService {
  async create(
    createUserSubjectDto: CreateUserSubjectDto,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      return prisma.user_subject.create({
        data: { ...createUserSubjectDto },
      });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error.message);
    }
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

  async userSubjectMarks(account_id: number, prisma: Prisma.TransactionClient) {
    return prisma.user_subject.findMany({
      where: { account_id },
      include: {
        subject: true,
      },
    });
  }
}
