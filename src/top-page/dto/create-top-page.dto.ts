import { TopLevelCategory } from '../top-page.model';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdvantageDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class HhDto {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class CreateTopPageDto {
  @IsEnum({
    Courses: 'Courses',
    Services: 'Services',
    Books: 'Books',
    Products: 'Products',
  })
  firstCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => HhDto)
  hh?: HhDto;

  @IsArray()
  @ValidateNested()
  @Type(() => AdvantageDto)
  advantages: AdvantageDto[];

  @IsString()
  seoText: string;

  @IsOptional()
  @IsString()
  tagsTitle?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
