import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: true, timestamps: true })
export class ReviewModel {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  @Prop()
  productId: Types.ObjectId;
}

export const ReviewModelSchema = SchemaFactory.createForClass(ReviewModel);
