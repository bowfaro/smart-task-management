import { Controller } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateNewAcDto } from './dto/create-new-ac.dto';
import { Body, Post } from '@nestjs/common';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Post('access-token')
  async refreshToken(
    @Body() createNewAcDto: CreateNewAcDto,
  ): Promise<{ accessToken: string }> {
    return this.tokenService.refreshToken(createNewAcDto.refreshToken);
  }
}
