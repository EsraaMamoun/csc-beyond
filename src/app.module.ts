import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { AccountModule } from './account/account.module';
import { TokenModule } from './token/token.module';
import { SubjectModule } from './subject/subject.module';
import { UserSubjectModule } from './user_subject/user_subject.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
    TokenModule,
    SubjectModule,
    UserSubjectModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
