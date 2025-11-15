import { Types } from "mongoose";

export interface IAddress {
  full: string;
  area: string;
  city: string;
}

export interface ICustomer {
  user_id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address?: IAddress;
  image?: string;
  isActive: boolean;
  isVerified: boolean;
  isProfileComplete: boolean;
}

export interface CustomerRegisterPayload
  extends Omit<
    ICustomer,
    "user_id" | "isActive" | "isVerified" | "address" | "image"
  > {
  password: string;
}
