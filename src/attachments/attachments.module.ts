import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService, FirebaseService],
})
export class AttachmentsModule {}
