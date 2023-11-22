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
    { password_confirmation, ...createAccountInput }: CreateAccountDto,
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

      if (createAccountInput.username.length < 8) {
        throw new Error(ErrorsEnum.username_must_be_at_least_8_characters_long);
      }

      if (createAccountInput.password) {
        if (createAccountInput.password.length < 8) {
          throw new Error(
            ErrorsEnum.password_must_be_at_least_8_characters_long,
          );
        }

        if (!/[A-Z]/.test(createAccountInput.password)) {
          throw new Error(
            ErrorsEnum.password_must_contain_at_least_one_uppercase_letter,
          );
        }

        if (!/[a-z]/.test(createAccountInput.password)) {
          throw new Error(
            ErrorsEnum.password_must_contain_at_least_one_lowercase_letter,
          );
        }

        if (!/\d/.test(createAccountInput.password)) {
          throw new Error(ErrorsEnum.password_must_contain_at_least_one_digit);
        }

        if (
          !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(createAccountInput.password)
        ) {
          throw new Error(
            ErrorsEnum.password_must_contain_at_least_one_special_character,
          );
        }
      }

      if (createAccountInput.password !== password_confirmation) {
        throw new Error(
          ErrorsEnum.password_and_password_confirmation_do_not_match,
        );
      }

      createAccountInput.password = await hash(createAccountInput.password, 10);

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
      throw new BadRequestException(error.message);
    }
  }

  async findAll(prisma: Prisma.TransactionClient) {
    try {
      return prisma.account.findMany({
        where: {
          is_deleted: false,
          account_type: AccountTypeEnum.user,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number, prisma: Prisma.TransactionClient) {
    try {
      return prisma.account.findFirst({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      if (updateAccountDto.username && updateAccountDto.username.length < 8) {
        throw new Error(ErrorsEnum.username_must_be_at_least_8_characters_long);
      }

      return prisma.account.update({
        where: { id },
        data: { ...updateAccountDto },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async activateAccount(id: number, prisma: Prisma.TransactionClient) {
    try {
      return prisma.account.update({
        where: { id },
        data: { is_active: true },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number, prisma: Prisma.TransactionClient) {
    try {
      await prisma.account.update({
        where: { id },
        data: { is_deleted: true },
      });

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
