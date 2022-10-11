import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Brand } from '../../../api/brands/entities/brand.entity';
import { Image } from '../../../api/images/entities/image.entity';
import { Product } from '../../../api/products/entities/product.entity';
import { InvoicesDetail } from '../../../api/invoices-details/entities/invoices-detail.entity';
import * as NUMBER from '../../../common/constants/numbers.constants';

export class CreateVariantDto {
  @Length(NUMBER.N02, NUMBER.N50)
  code: string;

  @IsString()
  @MaxLength(NUMBER.N50, {
    message: `El nombre de la variante no puede ser mayor a ${NUMBER.N50} caracteres.`,
  })
  @MinLength(NUMBER.N02, {
    message: `El nombre de variante debe contener almenos ${NUMBER.N02} caracteres.`,
  })
  name: string;

  @Length(NUMBER.MIN, NUMBER.N200)
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(NUMBER.MIN, {
    message: `El precio de credito de la variante debe ser un numero entero mayor o igual a ${NUMBER.MIN}`,
  })
  @Max(NUMBER.MAX, {
    message: `El precio de credito de la variante debe ser un monto real, menor a ${NUMBER.MAX}`,
  })
  price: number;

  @IsNumber()
  @Min(NUMBER.MIN, {
    message: `El precio de credito de la variante debe ser un numero entero mayor o igual a ${NUMBER.MIN}`,
  })
  @Max(NUMBER.MAX, {
    message: `El precio de credito de la variante debe ser un monto real, menor a ${NUMBER.MAX}`,
  })
  priceCredit: number;

  @IsNumber()
  @Min(NUMBER.MIN, {
    message: `El precio de credito de la variante debe ser un numero entero mayor o igual a ${NUMBER.MIN}`,
  })
  @Max(NUMBER.MAX, {
    message: `El precio de credito de la variante debe ser un monto real, menor a ${NUMBER.MAX}`,
  })
  cost: number;

  @IsInt()
  @Min(NUMBER.MIN, {
    message: `El precio de credito de la variante debe ser un numero entero mayor o igual a ${NUMBER.MIN}`,
  })
  @Max(NUMBER.MAX, {
    message: `El precio de credito de la variante debe ser un monto real, menor a ${NUMBER.MAX}`,
  })
  stock: number;

  @IsNumber()
  @IsOptional()
  @Min(NUMBER.MIN, {
    message: `El precio de credito de la variante debe ser un numero entero mayor o igual a ${NUMBER.MIN}`,
  })
  order?: number;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsOptional()
  @IsObject()
  invoiceDetail?: InvoicesDetail;

  @IsArray()
  @IsOptional()
  images?: Image[];

  @IsOptional()
  @IsObject()
  product?: Product;

  @IsOptional()
  @IsObject()
  brand?: Brand;
}
