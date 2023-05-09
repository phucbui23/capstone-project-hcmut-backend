import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OperatorLocalAuthGuard extends AuthGuard('operator') {}
