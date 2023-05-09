import { Module } from '@nestjs/common';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, FirebaseService, AttachmentsService],
})
export class ArticlesModule {}
