import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
  order: string;
  filter: string;
}

type CustomRequest = FastifyRequest<{
  Querystring: {
    page: string;
    size: string;
    offset: string;
    order: string;
    filter: string;
  };
}>;

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: CustomRequest = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const order = req.query.order ?? "ASC";
    const filter = req.query.filter;

    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
      throw new BadRequestException("Invalid pagination params");
    }

    if (size > 100) {
      throw new BadRequestException(
        "Invalid pagination params: Max size is 100",
      );
    }

    const limit = size;
    const offset = page * limit;

    return { page, limit, size, offset, order, filter } as Pagination;
  },
);
