// interfaces/IAdmin.ts
import { Types } from "mongoose";

export interface IAddress {
  full: string;
  area: string;
  city: string;
}

export interface IAdmin {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  image?: string;
  email: string;
  phone: string;
  address?: IAddress;
  isActive: boolean;
  isVerified: boolean;
}
