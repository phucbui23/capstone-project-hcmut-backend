import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, FirebaseService],
  exports: [ChatService],
})
export class ChatModule {}
