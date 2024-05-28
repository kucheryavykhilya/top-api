import { TopLevelCategory } from '../top-page.model';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class FindTopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @IsNumber()
  @IsOptional()
  limit: number;
}
