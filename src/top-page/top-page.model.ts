import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AdvantageDto, HhDto } from './dto/create-top-page.dto';
import { Index } from '@typegoose/typegoose';

// export enum TopLevelCategory {
//   Courses,
//   Services,
//   Books,
//   Products,
// }

export enum TopLevelCategory {
  Courses = 'Courses',
  Services = 'Services',
  Books = 'Books',
  Products = 'Products',
}

@Schema({ _id: true, timestamps: true })
export class TopPageModel {
  @Prop({ type: String, enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  // @Prop({ text: true })
  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop(
    raw({
      count: { type: Number },
      juniorSalary: { type: Number },
      middleSalary: { type: Number },
      seniorSalary: { type: Number },
    }),
  )
  hh?: HhDto;

  @Prop([
    raw({
      title: { type: String },
      description: { type: String },
    }),
  ])
  advantages: AdvantageDto[];

  @Prop()
  seoText: string;

  @Prop({ required: false })
  tagsTitle?: string;

  @Prop([String])
  tags: string[];
}

export const TopPageModelSchema = SchemaFactory.createForClass(TopPageModel);

TopPageModelSchema.index(
  {
    title: 'text',
    category: 'text',
    seoText: 'text',
    'advantages.title': 'text',
    'advantages.description': 'text',
    tagsTitle: 'text',
    tags: 'text',
    firstCategory: 'text',
    secondCategory: 'text',
  },
  { name: 'TextIndex' },
);

TopPageModelSchema.index({ alias: 1 }, { unique: true });

// TopPageModelSchema.index({ '$**': 1 });
// TopPageModelSchema.index({ title: 1, seoText: 1 }, { unique: true });
