import { Response } from "express";

interface IResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  mate?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  return res.status(data.statusCode).json(data);
};

export default sendResponse;
