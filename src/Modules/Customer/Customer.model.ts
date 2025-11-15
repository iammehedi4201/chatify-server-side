import { model, Schema } from "mongoose";
import { IAddress, ICustomer } from "./Customer.interface";

const addressSchema = new Schema<IAddress>(
  {
    full: { type: String, required: [true, "full address is required"] },
    area: { type: String, required: [true, "area is required"] },
    city: { type: String, required: [true, "city is required"] },
  },
  { _id: false },
);

const customerSchema = new Schema<ICustomer>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user_id is required"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      trim: true,
    },
    address: {
      type: addressSchema,
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Add after customerSchema
customerSchema.index({ user_id: 1 }, { unique: true });
customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ "address.city": 1 });
customerSchema.index({ isActive: 1 });

export const Customer = model<ICustomer>("Customer", customerSchema);
