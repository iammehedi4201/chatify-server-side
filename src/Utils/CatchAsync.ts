import { NextFunction, Request, RequestHandler, Response } from "express";

const CatchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default CatchAsync;
