import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewModel } from './review.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Model } from 'mongoose';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.contants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from "../pipes/id-validation.pipe";

@Controller('review')
export class ReviewController {
  constructor(
    @InjectModel(ReviewModel.name) private reviewModel: Model<ReviewModel>,
    private readonly reviewService: ReviewService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Delete('all')
  async deleteAllReviews() {
    const result = await this.reviewService.deleteAllReviews();
    return result;
  }
  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return deletedDoc;
  }

  @UseGuards(JwtGuard)
  @Delete('/products/:productId')
  async deleteByProductId(@Param('productId', IdValidationPipe) productId: string) {
    const deletedReviews =
      await this.reviewService.deleteByProductId(productId);
  }

  @UseGuards(JwtGuard)
  @Get('/products/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipe) productId: string,
    @UserEmail() email: string,
  ) {
    console.log(email);
    return this.reviewService.findByProductId(productId);
  }
}
