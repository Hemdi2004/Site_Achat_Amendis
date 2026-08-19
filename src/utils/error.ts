export class BadRequestError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
  }
}