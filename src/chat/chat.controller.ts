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
import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
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
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  async sendMsg(@Body() sendMsgDto: SendMsgDto) {
    const { content, senderId, roomId } = sendMsgDto;
    return await this.chatService.sendMsg(content, senderId, roomId);
  }

  @Get('conversations/:userCode')
  @Roles(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.HOSPITAL_ADMIN,
    UserRole.PATIENT,
  )
  async getConversations(@Param('userCode') userCode: string) {
    const result = await this.chatService.getRooms(userCode);
    return result;
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
