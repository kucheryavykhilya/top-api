import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ProductCharacteristic } from './product-characteristic.model';

@Schema({ _id: true, timestamps: true })
export class ProductModel {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  credit: number;

  @Prop()
  description: string;

  @Prop()
  advantages: string;

  @Prop()
  disadvantages: string;

  @Prop([String])
  categories: string[];

  @Prop([String])
  tags: string[];

  // @Prop({
  //   type: [
  //     { type: mongoose.Schema.Types.ObjectId, ref: ProductCharacteristic.name },
  //   ],
  // })
  @Prop([
    raw({
      name: { type: String },
      value: { type: String },
      _id: false,
    }),
  ])
  characteristics: ProductCharacteristic[];
}

export const ProductModelSchema = SchemaFactory.createForClass(ProductModel);
