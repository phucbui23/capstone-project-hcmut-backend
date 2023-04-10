import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipAuth } from 'src/guard/skip-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { InitConversationDto, SendMsgDto } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('conversation/init')
  @SkipAuth()
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
        throw 'wrongCode';
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
          'A new conversation is initiate between you and your healthcare professional',
        senderId: 'System',
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
  @SkipAuth()
  async sendMsg(@Body() sendMsgDto: SendMsgDto) {
    const { content, senderId, roomId } = sendMsgDto;
    return await this.chatService.sendMsg(content, senderId, roomId);
  }

  @Get('conversations/:userCode')
  @SkipAuth()
  async getConversations(@Param('userCode') userCode: string) {
    const result = await this.chatService.getRooms(userCode);
    return result;
  }

  @Get('messages/:roomId')
  @SkipAuth()
  async getMsg(@Param('roomId') roomId: string) {
    return await this.chatService.getRoomMsg(roomId);
  }
}
