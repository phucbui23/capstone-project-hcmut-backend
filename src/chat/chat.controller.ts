import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { AttachmentsService } from 'src/attachments/attachments.service';
import { IMAGE_MAX_SIZE } from 'src/constant';
import { Roles } from 'src/guard/roles.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { InitConversationDto, SendImgMsgDto, SendMsgDto } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
    private readonly attachmentsService: AttachmentsService,
  ) {}

  @Post('conversation/init')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  async initConversation(@Body() initConversationDto: InitConversationDto) {
    // check if doctor manage that patient
    const { patientCode, doctorCode } = initConversationDto;
    let user, doctor;

    try {
      user = await this.prismaService.userAccount.findUnique({
        where: { code: patientCode },
      });

      doctor = await this.prismaService.userAccount.findUnique({
        where: { code: doctorCode },
      });

      if (!user || !doctor) {
        throw 'Wrong Code';
      }
    } catch (wrongCode) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Can not find user or doctor.',
      });
    }

    try {
      const manage = await this.prismaService.doctorManagesPatient.findUnique({
        where: {
          doctorAccountId_patientAccountId: {
            doctorAccountId: doctor.id,
            patientAccountId: user.id,
          },
        },
      });

      if (!manage) throw 'manageErr';

      const newRoom = await this.chatService.createRoom(
        patientCode,
        doctorCode,
      );
      const { roomId } = newRoom;

      await this.sendMsg({
        content:
          'A new conversation is initiated between you and your healthcare professional',
        senderCode: 'System',
        roomId: roomId,
      });

      return newRoom;
    } catch (manageErr) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'This doctor does not manage this patient.',
      });
    }
  }

  @Post('send')
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  async sendMsg(@Body() sendMsgDto: SendMsgDto) {
    const { content, senderCode, roomId } = sendMsgDto;
    return await this.chatService.sendMsg(content, senderCode, roomId);
  }

  @Post('send/img')
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @UseInterceptors(FileInterceptor('file'))
  async sendImg(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: IMAGE_MAX_SIZE }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('data') data: any,
  ) {
    console.log(file);
    const jsonField = JSON.parse(data);
    const sendImgMsgDto = plainToClass(SendImgMsgDto, jsonField);
    const errors = await validate(sendImgMsgDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //upload file => get url
    const imgUrl = await this.attachmentsService.uploadImage(file);
    // send url as content
    return await this.chatService.sendMsg(
      imgUrl.downloadUrl,
      sendImgMsgDto.senderCode,
      sendImgMsgDto.roomId,
    );
  }

  @Post('send/image')
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  @UseInterceptors(FileInterceptor('image'))
  async sendImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: IMAGE_MAX_SIZE }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('data') data: any,
  ) {
    console.log(file);
    const jsonField = JSON.parse(data);
    const sendImgMsgDto = plainToClass(SendImgMsgDto, jsonField);
    const errors = await validate(sendImgMsgDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //upload file => get url
    const imgUrl = await this.attachmentsService.uploadImage(file);
    // send url as content
    return await this.chatService.sendMsg(
      imgUrl.downloadUrl,
      sendImgMsgDto.senderCode,
      sendImgMsgDto.roomId,
    );
  }

  @Get('conversations/:userCode')
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  async getConversations(@Param('userCode') userCode: string) {
    return await this.chatService.getRooms(userCode);
  }

  @Get('messages/:roomId')
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  async getMsg(@Param('roomId') roomId: string) {
    return await this.chatService.getRoomMsg(roomId);
  }
}
