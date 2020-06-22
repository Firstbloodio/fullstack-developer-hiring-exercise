import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Controller, Get, UseGuards, Post, Request, Body, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiBody, ApiBearerAuth, ApiProperty, ApiOkResponse } from '@nestjs/swagger';
import { APIHttpExceptionFilter } from '../http-exception.filter';
import { APISafeException } from '../apiexception';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';


/**
 * Throws if test API calls when not in testing mode.
 */
class NotTesting extends APISafeException {
}


/**
 * Do not let calling testing APIs if we are not in testing mode.
 */
@Injectable()
export class TestingGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if(process.env.NODE_ENV !== 'testing') {
      throw new NotTesting(`Backend not using testing database`);
    }
    return true;
  }
}


@Injectable()
@Controller('testing')
@UseGuards(TestingGuard)
@UseFilters(new APIHttpExceptionFilter())  // Nice error handling
export class TestingController {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private userService: UserService) {
  }

  @Get()
  @ApiOperation({ summary: "Check if backend is running in testing mode" })
  getHello(): string {
    return 'enabled';
  }

  @ApiOperation({ summary: "Reset testing database" })
  @Post('reset')
  async reset(): Promise<string> {

    Logger.log('Nuking users table');
    await this.userRepository.clear();

    Logger.log('Creating default testing user');
    await this.userService.register("testing@example.com", "Test-Moo", "test123", "+1-202-456-1414");
    await this.userService.confirmEmailForced("testing@example.com");
    return 'OK'
  }

}
