import { IJwtPayload } from "@/Modules/User/User.interface";

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}
