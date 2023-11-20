import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Prisma } from '@prisma/client';
import { Token, TokenReturn, Tokens } from './entities/token.entity';
import { TokenTypeEnum } from 'src/enums/token_type.enum';
import * as dayjs from 'dayjs';
import { Account } from 'src/account/entities/account.entity';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EnvVariables } from 'src/configurations/configuration.interface';
import { ConfigService } from '@nestjs/config';
import { AccountService } from 'src/account/account.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';
import { ErrorsEnum } from 'src/enums/errors.enum';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class TokenService {
  private logger;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVariables>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {
    this.logger = new Logger('Token Service');
  }

  async login(
    loginDto: LoginDto,
    deviceId: number,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      let account: Account;
      if (loginDto.email) {
        account = (await prisma.account.findFirst({
          where: {
            email: loginDto.email,
          },
        })) as Account;

        if (!loginDto.password) {
          throw new Error(ErrorsEnum.password_is_required);
        }

        if (!(await compare(loginDto.password, account.password))) {
          throw new Error(ErrorsEnum.invalid_password);
        }
      }

      if (!account) throw new Error(ErrorsEnum.account_not_found);

      const tokens = await this.generateAccessRefreshTokens(
        account.id,
        {
          email: loginDto.email,
        },
        prisma,
      );

      await prisma.device.update({
        where: {
          id: deviceId,
        },
        data: {
          account_id: account.id,
        },
      });

      return {
        ...account,
        tokens,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async create(
    createTokenInput: CreateTokenDto,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      return (await prisma.token.create({
        data: { ...createTokenInput },
      })) as Token;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async refreshToken(account: Account, prisma): Promise<TokenReturn> {
    try {
      this.logger.verbose('REFRESH TOKEN TRIGGERED');
      const tokens = await this.generateAccessRefreshTokens(
        account.id,
        {
          email: account.email,
        },
        prisma,
      );

      this.logger.log(
        `Access Token and refresh token for account with id of ${account.id} have been refreshed`,
      );

      return { result: !!tokens, tokens };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findAll(
    prisma: Prisma.TransactionClient,
    filter: Prisma.tokenWhereInput,
    page: number,
    pageSize: number,
  ) {
    try {
      return prisma.token.findMany({
        where: { ...filter },
        ...(page && {
          ...(page && {
            skip: Number(pageSize) * (page - 1),
            take: Number(pageSize),
          }),
        }),
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
  async findOne(id: number, prisma: Prisma.TransactionClient) {
    try {
      return prisma.token.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
  async update(
    id: number,
    updateTokenInput: UpdateTokenDto,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      return prisma.token.update({
        where: { id },
        data: { ...updateTokenInput },
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
  async remove(id: number, prisma: Prisma.TransactionClient) {
    try {
      await prisma.token.delete({ where: { id } });
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async validateAccessRefreshToken(payload: {
    email: string;
    token_id: number;
  }): Promise<boolean | Account> {
    try {
      return this.prismaService.$transaction(
        async (prisma) => {
          const token = await prisma.token.findFirst({
            where: {
              id: payload.token_id,
              expiry_date: { gte: new Date() },
            },
          });

          if (!token?.account_id) return false;

          this.logger.log(
            `${TokenTypeEnum[token.token_type]} Token has been validated`,
          );

          const account = await this.accountService.findOne(
            token.account_id,
            prisma,
          );

          if (!account) return false;

          return account as Account;
        },
        { timeout: 100000000, maxWait: 100000000 },
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  JWTSign(
    payload: { email?: string; token_id: number },
    expiry: string,
  ): string {
    try {
      const token = this.jwtService.sign(
        {
          ...payload,
          email: payload.email?.toLocaleLowerCase(),
        },
        { expiresIn: expiry, secret: this.configService.get('JWT_SECRET') },
      );
      this.logger.log('Token has been signed');
      return token;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error);
    }
  }

  async generateAccessRefreshTokens(
    account_id: number,
    payload: {
      email: string;
    },
    prisma,
  ): Promise<Tokens> {
    try {
      const tokens = await this.generateAccessRefreshTokensDocuments(
        account_id,
        prisma,
      );

      const signedAccessToken = this.JWTSign(
        { token_id: tokens.access_token.id, ...payload },
        '24h',
      );

      const signedRefreshToken = this.JWTSign(
        { token_id: tokens.refresh_token.id, ...payload },
        '30d',
      );

      await this.updateTokens(
        {
          access_token: signedAccessToken,
          refresh_token: signedRefreshToken,
        },
        prisma,
        tokens.access_token,
        tokens.refresh_token,
      );

      return {
        access_token: signedAccessToken,
        refresh_token: signedRefreshToken,
      };
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error);
    }
  }

  async generateAccessRefreshTokensDocuments(
    account_id: number,
    prisma,
  ): Promise<{ access_token: Token; refresh_token: Token }> {
    try {
      const accessToken: Token = await this.create(
        {
          account_id,
          expiry_date: dayjs().add(24, 'h').toDate(),
          token_type: TokenTypeEnum.access,
        },
        prisma,
      );

      const refreshToken: Token = await this.create(
        {
          account_id,
          related_token_id: accessToken.id,
          expiry_date: dayjs().add(30, 'd').toDate(),
          token_type: TokenTypeEnum.refresh,
        },
        prisma,
      );

      return {
        access_token: accessToken,

        refresh_token: refreshToken,
      };
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error);
    }
  }

  async updateTokens(
    { ...updateTokens }: UpdateTokenDto,
    prisma: Prisma.TransactionClient,
    access_token?: Token,
    refresh_token?: Token,
    temp_token?: Token,
  ): Promise<boolean> {
    try {
      if (access_token) {
        await prisma.token.update({
          where: { id: access_token.id },
          data: {
            token_data: updateTokens.access_token,
          },
        });
      }

      if (refresh_token) {
        await prisma.token.update({
          where: { id: refresh_token.id },
          data: {
            token_data: updateTokens.refresh_token,
          },
        });
      }

      if (temp_token) {
        await prisma.token.update({
          where: { id: temp_token.id },
          data: {
            token_data: updateTokens.temp_token,
          },
        });
      }

      return true;
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(error);
    }
  }

  async logout(
    token: string,
    prisma: Prisma.TransactionClient,
    device_id: string,
  ) {
    try {
      token = token.split(' ')[1];

      const account_id = (
        await prisma.token.findFirst({
          where: { token_data: token },
        })
      ).account_id;

      await prisma.token.updateMany({
        where: { account_id, token_data: token.split(' ')[1] },
        data: { expiry_date: dayjs().toDate(), is_deleted: true },
      });

      await prisma.device.update({
        where: { id: +device_id },
        data: { account_id: null },
      });

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
