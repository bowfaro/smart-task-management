import { Controller, Get, Req, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './types/user.type';
import { plainToClass } from 'class-transformer';
import { JwtAuth } from 'src/common/decorators/jwt-auth.decorator';
import { ApiBearerAuth } from 'node_modules/@nestjs/swagger/dist/decorators/api-bearer.decorator';

@ApiBearerAuth()
@JwtAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getCurrentUser(@Request() req): Promise<UserResponse> {
    const { userLogged } = req;
    const user = plainToClass(UserResponse, userLogged, {
      excludeExtraneousValues: true,
    });
    return user;
  }
}
