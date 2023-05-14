import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from 'src/auth/auth.helper';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserAccountsController } from './user-accounts.controller';
import { UserAccountsService } from './user-accounts.service';

@Module({
  controllers: [UserAccountsController],
  providers: [UserAccountsService, AuthHelper, JwtService, FirebaseService],
})
export class UserAccountsModule {}
