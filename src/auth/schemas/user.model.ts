import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true, timestamps: true })
export class UserModel {
  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);
