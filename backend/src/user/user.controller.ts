import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters } from '@nestjs/common';
import { UserOwnInfoDto } from './user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { APIHttpExceptionFilter } from '../http-exception.filter';

@Controller('users')
@UseFilters(new APIHttpExceptionFilter())  // Nice error handling
export class UserController {

  constructor(private readonly userService: UserService) {}



}

