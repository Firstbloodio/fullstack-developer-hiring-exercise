
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * TODO: Check user.securityOperationPerformedAt > session.createdAt
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

