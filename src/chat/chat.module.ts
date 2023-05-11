import { Module } from '@nestjs/common';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, FirebaseService, AttachmentsService],
  exports: [ChatService],
})
export class ChatModule {}
