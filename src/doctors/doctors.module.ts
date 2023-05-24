import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserAccountsModule } from 'src/user-accounts/user-accounts.module';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';

@Module({
  imports: [PrismaModule, UserAccountsModule],
  controllers: [DoctorsController],
  providers: [DoctorsService, FirebaseService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
