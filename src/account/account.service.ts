import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Prisma } from '@prisma/client';
import { Tokens } from 'src/token/entities/token.entity';
import { AccountTypeEnum } from 'src/enums/account_type.enum';
import { ErrorsEnum } from 'src/enums/errors.enum';
import { TokenService } from 'src/token/token.service';
import { hash } from 'bcrypt';
import { AccountFilter } from './entities/account.entity';

@Injectable()
export class AccountService {
  private logger;

  constructor(
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
  ) {
    this.logger = new Logger('Account Service');
  }
  async createAccount(
    createAccountInput: CreateAccountDto,
    prisma: Prisma.TransactionClient,
    // device_id: number,
  ) {
    try {
      if (createAccountInput.email) {
        createAccountInput.email = createAccountInput.email.toLowerCase();
        const accountCheck = await prisma.account.findFirst({
          where: {
            email: createAccountInput.email,
          },
        });

        if (accountCheck) {
          throw new Error(ErrorsEnum.email_is_already_in_use);
        }
      }

      if (createAccountInput.password) {
        createAccountInput.password = await hash(
          createAccountInput.password,
          10,
        );
      }

      const account = await prisma.account.create({
        data: {
          ...createAccountInput,
        },
      });

      const tokens: Tokens =
        await this.tokenService.generateAccessRefreshTokens(
          account.id,
          {
            email: account.email,
          },
          prisma,
        );

      // await prisma.device.update({
      //   where: { id: device_id },
      //   data: { account_id: account.id, updated_at: new Date() },
      // });

      return { ...account, tokens };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findAll(prisma: Prisma.TransactionClient) {
    return prisma.account.findMany({
      where: {
        is_deleted: false,
      },
    });
  }

  async findOne(id: number, prisma: Prisma.TransactionClient) {
    return prisma.account.findFirst({
      where: { id },
    });
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
    prisma: Prisma.TransactionClient,
  ) {
    return prisma.account.update({
      where: { id },
      data: { ...updateAccountDto },
    });
  }

  async remove(id: number, prisma: Prisma.TransactionClient) {
    await prisma.account.update({
      where: { id },
      data: { is_deleted: true },
    });

    return true;
  }
}
