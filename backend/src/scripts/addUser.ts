/**
 * Adds a user from the command line.
 *
 */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UserService } from "../user/user.service";
import { Logger } from "@nestjs/common";
import { strict as assert } from 'assert';

const argv = require('yargs').argv

async function bootstrap() {
  // https://docs.nestjs.com/standalone-applications
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService)

  const { email, password, displayName, phone } = argv;

  Logger.log(`Register a new user ${email} ${displayName} ${password}`);

  const u = await userService.register(email, displayName, password, phone);
  assert(u.passwordHash);

  const user = await userService.confirmEmailForced(email);

  assert(user.passwordHash);
  assert(user.canLogIn(), 'Freshly created user cannot log in');

  const uuid = user.publicId;
  Logger.log(`User ${email} created with primary key ${user.id} and public UUID ${uuid}`);
}

bootstrap();