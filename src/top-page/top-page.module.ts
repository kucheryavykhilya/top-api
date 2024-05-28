import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageModel, TopPageModelSchema } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
  controllers: [TopPageController],
  providers: [ConfigService, TopPageService],
  imports: [
    MongooseModule.forFeature([
      {
        name: TopPageModel.name,
        schema: TopPageModelSchema,
      },
    ]),
  ],
})
export class TopPageModule {}
