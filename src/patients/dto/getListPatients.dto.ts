import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PAGINATION } from 'src/constant';

export class GetListPatientsDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  page: number = 1;

  @ApiProperty({ required: false, default: PAGINATION.PERPAGE })
  @IsNumber()
  perPage: number = PAGINATION.PERPAGE;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  field: string = '';

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsString()
  @IsOptional()
  order: string = '';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string = '';
}
