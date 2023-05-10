import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { AttachmentsService } from './attachments.service';
@ApiTags('attchments')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @ApiProperty({
    name: 'userAccountId',
    description: 'user account id',
  })
  @ApiParam({
    name: 'file',
    description: 'File to upload',
    type: 'file',
  })
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @Post('/upload/:userAccountId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('userAccountId', ParseIntPipe) userAccountId: number,
  ) {
    return await this.attachmentsService.uploadImage(file, userAccountId);
  }

  // @Roles(UserRole.ADMIN)
  // @Get()
  // findAll() {
  //   return this.attachmentsService.findAll();
  // }

  // @Roles(UserRole.ADMIN)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.attachmentsService.findOne(+id);
  // }

  // @Roles(UserRole.ADMIN)
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAttachmentDto: UpdateAttachmentDto,
  // ) {
  //   return this.attachmentsService.update(+id, updateAttachmentDto);
  // }

  // @Roles(UserRole.ADMIN)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.attachmentsService.remove(+id);
  // }
}
