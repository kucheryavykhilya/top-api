import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { ConfigService } from '@nestjs/config';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly configService: ConfigService,
    private readonly topPageService: TopPageService,
  ) {
    const ab = this.configService.get('TEST');
  }
  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.createTopPage(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.topPageService.getById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    return this.topPageService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.topPageService.delete(id);
  }

  @HttpCode(200)
  @Post('find')
  @UsePipes(new ValidationPipe())
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto);
  }

  @HttpCode(200)
  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.textSearch(text);
  }
}
