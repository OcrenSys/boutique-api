import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Category } from '../../../database/models/category.entity';
import { Image } from '../../../database/models/image.entity';
import { Product } from '../../../database/models/product.entity';
import { SubCategory } from '../../../database/models/sub-category.entity';
import * as NUMBER from '../../../common/constants/numbers.constants';

export class CreateBannerDto {
  @IsString()
  @MaxLength(NUMBER.N50, {
    message: `El nombre del Banner no puede ser mayor a ${NUMBER.N50} caracteres.`,
  })
  @MinLength(NUMBER.N02, {
    message: `El nombrel Banner debe contener almenos ${NUMBER.N02} caracteres.`,
  })
  name: string;

  @IsString()
  @Length(NUMBER.N00, NUMBER.N200, {
    /**
     * Specifies if validated value is an array and each of its items must be validated.
     */
    each: true,
    /**
     * Error message to be used on validation fail.
     * Message can be either string or a function that returns a string.
     */
    message: `La descripción del banner debe ser mayor a ${NUMBER.N00} y menor de ${NUMBER.N200} caracteres`,
    /**
     * Validation groups used for this validation.
     */
    groups: [],
    /**
     * Indicates if validation must be performed always, no matter of validation groups used.
     */
    always: true,

    context: null,
  })
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  image?: Image;

  @IsArray()
  @IsOptional()
  products?: Product[];

  @IsArray()
  @IsOptional()
  categories?: Category[];

  @IsArray()
  @IsOptional()
  subCategories?: SubCategory[];
}
