import {
  IsArray,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as NUMBER from '../../../common/constants/numbers.constants';
import { Product } from '../../../api/products/entities/product.entity';
export class CreateBrandDto {
  @IsString()
  @MaxLength(NUMBER.N50, {
    message: `El nombre de la variante no puede ser mayor a ${NUMBER.N50} caracteres.`,
  })
  @MinLength(NUMBER.N02, {
    message: `El nombre de variante debe contener almenos ${NUMBER.N02} caracteres.`,
  })
  name: string;

  @IsString()
  @Length(NUMBER.MIN, NUMBER.N200)
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  products: Product[];
}
