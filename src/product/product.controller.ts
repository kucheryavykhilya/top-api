import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductCharacteristic } from './product-characteristic.model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND_ERROR } from './product.contants';
import { Model } from 'mongoose';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('product')
export class ProductController {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductModel>,
    @InjectModel(ProductCharacteristic.name)
    private readonly productCharacteristic: Model<ProductCharacteristic>,
    private readonly productService: ProductService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return product;
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedProduct = await this.productService.deleteById(id);
    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return deletedProduct;
  }

  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ProductModel,
  ) {
    const updatedProduct = await this.productService.patchById(id, dto);
    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return updatedProduct;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return await this.productService.findWithReviews(dto);
  }
}
