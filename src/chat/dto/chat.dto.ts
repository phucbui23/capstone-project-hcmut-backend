import { IsNotEmpty, IsString } from 'class-validator';

export class InitConversationDto {
  @IsString()
  @IsNotEmpty()
  patientCode: string;

  @IsString()
  @IsNotEmpty()
  doctorCode: string;
}

export class SendMsgDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}
