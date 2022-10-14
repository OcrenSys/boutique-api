import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Image } from '../images/entities/image.entity';
import { HandleExceptions } from 'src/common/helpers/handle.exceptions';

@Module({
  controllers: [BannersController],
  providers: [BannersService, HandleExceptions],
  imports: [TypeOrmModule.forFeature([Banner, Image])],
})
export class BannersModule {}
