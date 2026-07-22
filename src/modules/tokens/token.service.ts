import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MESSAGE } from 'src/common/constants/message';
import { TokenEntity } from 'src/database/entities/token.entity';
import * as jwt from 'jsonwebtoken';
import { DeepPartial, Repository } from 'typeorm';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { generateKeyOfToken } from 'src/helper/crypto.helper';
import { TokenResponse } from './types/token.type';
import { TokenData } from './types/token-data.type';

@Injectable()
export class TokenService {
  public publicKey: string;

  private expiredAccessToken = '1d';
  private expiredRefreshToken = '7d';
  private expiredVerifyToken = '15m';

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(TokenEntity)
    private readonly tokenRes: Repository<TokenEntity>,
  ) {}

  async getOne(id: string): Promise<TokenEntity> {
    const token = await this.tokenRes.findOne({ where: { id } });
    if (!token) {
      throw new UnauthorizedException(MESSAGE.INVALID_OR_EXPIRED_TOKEN);
    }
    return token;
  }

  async deleteOne(id: string): Promise<void> {
    await this.tokenRes.delete({ id });
  }

  async save(token: DeepPartial<TokenEntity>): Promise<TokenEntity> {
    return await this.tokenRes.save(token);
  }

  generateToken(payload: any, key: string, expiresIn: any) {
    const options: jwt.SignOptions = {
      expiresIn: expiresIn,
      algorithm: 'RS256',
      allowInsecureKeySizes: true,
    };
    const token = jwt.sign(payload, key, options);
    return token;
  }

  async createOne(
    payload: TokenPayloadDto,
    isVerifyToken: boolean = false,
  ): Promise<TokenResponse> {
    const { publicKey: accessPublicKey, privateKey: accessPrivateKey }: any =
      await generateKeyOfToken();
    const { publicKey: refreshPublicKey, privateKey: refreshPrivateKey }: any =
      await generateKeyOfToken();

    const currentDate = new Date();

    const expiresAt = new Date();
    if (isVerifyToken) {
      expiresAt.setMinutes(15);
    } else {
      expiresAt.setMonth(
        currentDate.getMonth() === 12 ? 1 : currentDate.getMonth() + 1,
      );
    }
    const dataToken = {
      refreshToken: '',
      userId: payload.userId,
      accessPublicKey,
      refreshPublicKey,
      expiresAt,
      createAt: new Date().getTime(),
    };

    const token = await this.save(dataToken);
    const payloadFormat = JSON.stringify({ ...payload, tokenId: token.id });

    const accessToken = this.generateToken(
      JSON.parse(payloadFormat),
      accessPrivateKey,
      isVerifyToken ? this.expiredVerifyToken : this.expiredAccessToken,
    );
    const refreshToken = this.generateToken(
      JSON.parse(payloadFormat),
      refreshPrivateKey,
      this.expiredRefreshToken,
    );

    token.refreshToken = refreshToken;

    await this.save(token);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(accessToken: string): Promise<TokenData> {
    try {
      if (!accessToken) {
        throw new UnauthorizedException(MESSAGE.INVALID_OR_EXPIRED_TOKEN);
      }
      const payload = this.jwtService.decode(accessToken);

      const { tokenId } = payload;
      const tokenDb = await this.getOne(tokenId);

      if (!tokenDb) {
        throw new UnauthorizedException(MESSAGE.INVALID_OR_EXPIRED_TOKEN);
      }

      const publicKey = tokenDb.accessPublicKey;

      jwt.verify(accessToken, publicKey, (err, decoded) => {
        if (err) {
          throw new UnauthorizedException(MESSAGE.INVALID_OR_EXPIRED_TOKEN);
        }
      });

      return payload;
    } catch (err) {
      throw new UnauthorizedException(MESSAGE.INVALID_OR_EXPIRED_TOKEN);
    }
  }
}
