import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagListResponse } from './types/tag.type';
import { Repository } from 'typeorm';
import { TagEntity } from 'src/database/entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { MessageResponse } from 'src/common/types/response';
import { MESSAGE } from 'src/common/constants/message';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async getTags(userId: string): Promise<TagListResponse> {
    const tags = await this.tagRepository.find({ where: { user_id: userId } });
    return {
      items: tags,
      total: tags.length,
    };
  }
  async createTag(createTagDto: CreateTagDto): Promise<MessageResponse> {
    const tag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(tag);
    return {
      statusCode: 201,
      message: MESSAGE.TAG_CREATED,
    };
  }

  async updateTag(
    updateTagDto: CreateTagDto,
    tagId: string,
  ): Promise<MessageResponse> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });
    if (!tag) {
      throw new NotFoundException(MESSAGE.TAG_NOT_FOUND);
    }
    Object.assign(tag, updateTagDto);
    await this.tagRepository.save(tag);
    return {
      statusCode: 200,
      message: MESSAGE.TAG_UPDATED,
    };
  }

  async deleteTag(tagId: string): Promise<MessageResponse> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });
    if (!tag) {
      throw new NotFoundException(MESSAGE.TAG_NOT_FOUND);
    }
    await this.tagRepository.remove(tag);
    return {
      statusCode: 200,
      message: MESSAGE.TAG_DELETED,
    };
  }
}
