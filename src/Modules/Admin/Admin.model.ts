// models/Admin.ts
import { model, Schema } from "mongoose";
import { IAddress, IAdmin } from "./Admin.interface";

const addressSchema = new Schema<IAddress>(
  {
    full: { type: String, required: [true, "full address is required"] },
    area: { type: String, required: [true, "area is required"] },
    city: { type: String, required: [true, "city is required"] },
  },
  { _id: false },
);

const adminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: [true, "Name is required"] },
    image: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    address: { type: addressSchema },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "admins",
  },
);

// === INDEXES ===
adminSchema.index({ userId: 1 }, { unique: true });
adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ isActive: 1 });

export const Admin = model<IAdmin>("Admin", adminSchema);
