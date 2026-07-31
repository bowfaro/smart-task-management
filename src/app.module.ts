import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import ormConfig from './config/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './modules/tokens/token.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import dataSource from './config/ormconfig';
import { TaskModule } from './modules/tasks/task.module';
import { TagModule } from './modules/tags/tag.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRoot(dataSource.options),
    TokenModule,
    AuthModule,
    UserModule,
    TaskModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
