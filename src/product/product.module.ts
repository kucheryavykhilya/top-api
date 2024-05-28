import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductCharacteristic,
  ProductCharacteristicSchema,
} from './product-characteristic.model';
import { ProductModel, ProductModelSchema } from './product.model';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCharacteristic.name,
        schema: ProductCharacteristicSchema,
      },
      {
        name: ProductModel.name,
        schema: ProductModelSchema,
      },
    ]),
  ],
  providers: [ProductService],
})
export class ProductModule {}
