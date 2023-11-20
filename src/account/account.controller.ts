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
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma.service';
import { AccountFilter } from './entities/account.entity';
import { CurrentDevice } from 'src/decorators/device.decorator';
import { ApiTags } from '@nestjs/swagger';
import { TokenService } from 'src/token/token.service';
import { CurrentToken } from 'src/decorators/token.decorator';

import { ApiHeaders } from 'src/decorators/headers.decorator';
import { CustomAuthGuard } from 'src/guards/auth.guard';
import { LoginDto } from 'src/token/dto/login.dto';

@Controller('account')
@ApiTags('Account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiHeaders({ withAuth: false })
  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @CurrentDevice() device_id: string,
  ) {
    try {
      console.log('check 5');

      console.log({ device_id }, createAccountDto);
      return this.prismaService.$transaction(async (prisma) => {
        return this.accountService.createAccount(
          createAccountDto,
          prisma,
          +device_id,
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  @ApiHeaders({ withAuth: true })
  @UseGuards(CustomAuthGuard)
  @Get()
  findAll() {
    return this.prismaService.$transaction(async (prisma) => {
      return this.accountService.findAll(prisma);
    });
  }

  @ApiHeaders({ withAuth: true })
  @UseGuards(CustomAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.accountService.findOne(+id, prisma);
    });
  }

  @ApiHeaders({ withAuth: true })
  @UseGuards(CustomAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.accountService.update(+id, updateAccountDto, prisma);
    });
  }

  @ApiHeaders({ withAuth: true })
  @UseGuards(CustomAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.accountService.remove(+id, prisma);
    });
  }
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiHeaders({ withAuth: false })
  @Post('login')
  login(@Body() loginDto: LoginDto, @CurrentDevice() device_id: string) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.tokenService.login(loginDto, +device_id, prisma);
    });
  }

  @ApiHeaders({ withAuth: true })
  @UseGuards(CustomAuthGuard)
  @Post('logout')
  logout(@CurrentToken() token: string, @CurrentDevice() device_id: string) {
    return this.prismaService.$transaction(async (prisma) => {
      return this.tokenService.logout(token, prisma, device_id);
    });
  }
}
