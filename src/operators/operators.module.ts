import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserAccountsModule } from 'src/user-accounts/user-accounts.module';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';

@Module({
  imports: [PrismaModule, UserAccountsModule],
  controllers: [OperatorsController],
  providers: [OperatorsService],
  exports: [OperatorsService],
})
export class OperatorsModule {}
