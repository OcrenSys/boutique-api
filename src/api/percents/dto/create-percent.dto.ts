import { IsDecimal, IsInt, IsObject, IsOptional } from 'class-validator';
import { Credit } from '../../../api/credits/entities/credit.entity';

export class CreatePercentDto {
  @IsInt()
  fee: number;

  @IsDecimal()
  rate: number;

  @IsObject()
  @IsOptional()
  credits?: Credit[];
}
