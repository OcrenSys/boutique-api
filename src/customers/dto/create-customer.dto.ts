import {
  IsInt,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(2, {
    message: 'The nickname is too short: $value',
  })
  @MaxLength(20, {
    message: 'The nickname is too short: $value',
  })
  readonly nickName: string;

  @IsString()
  @MinLength(3, {
    message: 'The name is too short: $value',
  })
  @MaxLength(50, {
    message: 'The name is too short: $value',
  })
  readonly name: string;

  @IsString()
  @MinLength(3, {
    message: 'The lastName is too short: $value',
  })
  @MaxLength(50, {
    message: 'The lastName is too short: $value',
  })
  readonly lastName: string;

  @IsString()
  @Min(8)
  @Max(14)
  readonly phone: string;

  @IsString()
  readonly address: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  readonly limit: number;
}
