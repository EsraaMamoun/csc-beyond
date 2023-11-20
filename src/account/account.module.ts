import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController, AuthController } from './account.controller';
import { PrismaService } from 'src/prisma.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [forwardRef(() => TokenModule)],
  controllers: [AccountController, AuthController],
  providers: [AccountService, PrismaService],
  exports: [AccountService],
})
export class AccountModule {}
