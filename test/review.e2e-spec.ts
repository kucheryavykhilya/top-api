import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { ReviewModel } from '../src/review/review.model';
import { REVIEW_NOT_FOUND } from '../src/review/review.contants';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Title test',
  rating: 5,
  description: 'description test',
  productId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let createdReview: ReviewModel;
  let access_token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: 'email23@mail.ru',
        password: '1111',
      })
      .expect(200);

    const { body } = authResponse;
    access_token = body.access_token;
  });

  it('/review/create (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(201);

    const { body } = response;
    createdId = body._id;
    createdReview = body;
    expect(createdId).toBeDefined();
  });

  it('/review/create (POST) with not valid data', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send({
        name: 'Test',
        title: 'Title test',
        rating: 6,
        description: 'description test',
        productId,
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);
  });

  it('/products/:productId (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/review/products/${createdReview.productId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    const { body } = response;
    expect(body).toEqual([createdReview]);
  });

  it('/review (DELETE) - success', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    const { body } = response;
    createdId = body._id;
    expect(createdId).toBeDefined();
  });

  it('/review (DELETE) - fail', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/review/2342342342`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(500, {
        statusCode: 500,
        message: 'Internal server error',
      });
  });

  it('/review/all (DELETE) - success', async () => {
    const deletedReviewResponse = await request(app.getHttpServer())
      .delete(`/review/all`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    const reviewsResponse = await request(app.getHttpServer())
      .get(`/review`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    const { body } = reviewsResponse;

    expect(body.length).toBe(0);
  });

  it('/review (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/review`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    const { body } = response;

    expect(body).toEqual([]);

    // if (body.length !== 0) {
    //   for await (const review of body) {
    //     const reviewDeleteRes = await request(app.getHttpServer())
    //       .delete(`/review/${review._id}`)
    //       .expect(200);
    //   }
    //   const newReviewResponse = await request(app.getHttpServer())
    //     .get(`/review`)
    //     .expect(200);
    //   const { body: newBody } = newReviewResponse;
    //   expect(newBody).toEqual([]);
    // } else {
    //   expect(body).toEqual([]);
    // }
  });

  afterAll(() => {
    disconnect();
  });
});
