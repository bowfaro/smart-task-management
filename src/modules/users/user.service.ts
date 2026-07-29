import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { MESSAGE } from 'src/common/constants/message';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { phone } });
    return user;
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(MESSAGE.USER_NOT_FOUND);
    }
    return user;
  } 
  
  async save(user: DeepPartial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }
}
