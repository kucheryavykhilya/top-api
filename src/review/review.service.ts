import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewModel } from './review.model';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel.name)
    private readonly reviewModel: Model<ReviewModel>,
  ) {}

  async create({
    productId,
    ...rest
  }: CreateReviewDto): Promise<HydratedDocument<ReviewModel>> {
    return this.reviewModel.create({
      productId: new Types.ObjectId(productId),
      ...rest,
    });
  }

  async delete(id: string): Promise<HydratedDocument<ReviewModel | null>> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async getAll(): Promise<HydratedDocument<ReviewModel | null>[]> {
    return this.reviewModel.find();
  }

  async findByProductId(
    productId: string,
  ): Promise<HydratedDocument<ReviewModel>[]> {
    return this.reviewModel.find({ productId }).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel
      .deleteMany({ productId: new Types.ObjectId(productId) })
      .exec();
  }

  async deleteAllReviews() {
    return this.reviewModel.deleteMany({}).exec();
  }
}
