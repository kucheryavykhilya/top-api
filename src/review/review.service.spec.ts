import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';

describe('ReviewService', () => {
  let reviewService: ReviewService;

  const exec = { exec: jest.fn() };
  const reviewRepositoryFactory = () => ({
    find: () => exec,
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          useFactory: reviewRepositoryFactory,
          provide: getModelToken('ReviewModel'),
        },
      ],
    }).compile();

    reviewService = app.get<ReviewService>(ReviewService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(reviewService).toBeDefined();
    });
  });

  it('findByProductId working', async () => {
    const id = new Types.ObjectId().toHexString();
    reviewRepositoryFactory()
      .find()
      .exec.mockReturnValueOnce([{ productId: id }]);
    const res = await reviewService.findByProductId(id);
    expect(res[0].productId).toBe(id);
  });
});
