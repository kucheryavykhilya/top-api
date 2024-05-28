import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ProductCharacteristic {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

export const ProductCharacteristicSchema = SchemaFactory.createForClass(
  ProductCharacteristic,
);
