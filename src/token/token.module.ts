import { Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [forwardRef(() => AccountModule), ConfigModule],
  providers: [TokenService, PrismaService, JwtStrategy, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
