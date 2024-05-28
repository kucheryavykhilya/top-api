import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPageModel } from './top-page.model';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel.name)
    private readonly topPageModel: Model<TopPageModel>,
  ) {}

  async createTopPage(dto: TopPageModel) {
    return await this.topPageModel.create(dto);
  }

  async getById(id: string) {
    const topPage = await this.topPageModel
      .findById(id, { firstCategory: 1 })
      .exec();
    if (!topPage) {
      throw new BadRequestException();
    }
    return topPage;
  }

  async update(id: string, dto: CreateTopPageDto) {
    const topPage = await this.topPageModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!topPage) {
      throw new BadRequestException();
    }
    return topPage;
  }

  async delete(id: string) {
    const deletedTopPage = await this.topPageModel.findByIdAndDelete(id).exec();
    if (!deletedTopPage) {
      throw new BadRequestException();
    }
    return deletedTopPage;
  }

  async findByCategory(dto: FindTopPageDto) {
    return this.topPageModel
      .aggregate([
        {
          $match: { firstCategory: dto.firstCategory },
        },
        {
          $group: {
            _id: '$secondCategory',
            pages: {
              $push: {
                alias: '$alias',
                title: '$title',
              },
            },
          },
        },
      ])
      .exec();
  }

  // async findByCategory(dto: FindTopPageDto) {
  //   const topPages = await this.topPageModel
  //     .aggregate([
  //       {
  //         $match: {
  //           firstCategory: dto.firstCategory,
  //         },
  //       },
  //       {
  //         $sort: {
  //           _id: 1,
  //         },
  //       },
  //       {
  //         $limit: dto.limit,
  //       },
  //       {
  //         $facet: {
  //           paginatedResults: [{ $skip: 0 }, { $limit: dto.limit }],
  //           totalCount: [
  //             {
  //               $count: 'count',
  //             },
  //           ],
  //         },
  //       },
  //     ])
  //     .exec();
  //   return topPages;
  // }

  async textSearch(text: string) {
    return this.topPageModel
      .find({
        $text: { $search: text, $caseSensitive: false },
      })
      .exec();
  }
}
