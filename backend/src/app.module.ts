import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { LocalStrategy } from './auth/local.strategy';
import { join } from 'path';
import { UserRepository } from './user/user.repository';


import * as ormConfig from './config/ormConfig';

console.log("Config", ormConfig);

@Module({
  imports: [

    TypeOrmModule.forRoot(ormConfig),

    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController, UserController],
  providers: [UserService, AppService, AuthService, LocalStrategy],
})
export class AppModule {}

