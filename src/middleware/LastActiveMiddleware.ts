import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LastActiveMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return next;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
      };
      const userId = parseInt(decoded.sub, 10);

      await this.prismaService.userAccount.update({
        where: {
          id: userId,
        },
        data: {
          lastActive: new Date(),
        },
      });
    } catch (error) {
      console.log(error);
    }
    next();
  }
}
