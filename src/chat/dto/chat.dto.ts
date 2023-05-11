import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitConversationDto {
  @ApiProperty({
    description: 'Patient user code',
  })
  @IsString()
  @IsNotEmpty()
  patientCode: string;

  @ApiProperty({
    description: 'Doctor user code',
  })
  @IsString()
  @IsNotEmpty()
  doctorCode: string;
}

export class SendMsgDto {
  @ApiProperty({
    description: 'Content of the message',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Sender user code',
  })
  @IsString()
  @IsNotEmpty()
  senderCode: string;

  @ApiProperty({
    description: 'Room id',
  })
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class SendImgMsgDto {
  @ApiProperty({
    description: 'Sender user code',
  })
  @IsString()
  @IsNotEmpty()
  senderCode: string;

  @ApiProperty({
    description: 'Room id',
  })
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
