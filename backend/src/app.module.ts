import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { LocalStrategy } from './auth/local.strategy';
import { TestingController } from './testing/testing.controller';
import * as ormConfig from './config/ormConfig';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [

    TypeOrmModule.forRoot(ormConfig),

    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AppController, TestingController],
  providers: [UserService, AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}

