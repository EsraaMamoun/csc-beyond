import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserSubjectDto } from './dto/create-user_subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user_subject.dto';
import { Prisma } from '@prisma/client';
import { ErrorsEnum } from 'src/enums/errors.enum';

@Injectable()
export class UserSubjectService {
  async create(
    createUserSubjectDto: CreateUserSubjectDto,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      const userSubject = await prisma.user_subject.findFirst({
        where: {
          account_id: createUserSubjectDto.account_id,
          subject_id: createUserSubjectDto.subject_id,
        },
      });

      if (!!userSubject) {
        throw new Error(ErrorsEnum.subject_already_assigned_to_the_user);
      }

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
    updateUserSubjectDto: UpdateUserSubjectDto,
    prisma: Prisma.TransactionClient,
  ) {
    return prisma.user_subject.update({
      where: { id },
      data: { ...updateUserSubjectDto },
    });
  }

  async updateUsingAccountSubjectIds(
    updateUserSubjectDto: UpdateUserSubjectDto,
    prisma: Prisma.TransactionClient,
  ) {
    return prisma.user_subject.updateMany({
      where: {
        subject_id: updateUserSubjectDto.subject_id,
        account_id: updateUserSubjectDto.account_id,
      },
      data: { mark: updateUserSubjectDto.mark },
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
