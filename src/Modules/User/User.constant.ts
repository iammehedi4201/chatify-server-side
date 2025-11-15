export const userRoles = {
  Customer: "Customer",
  Admin: "Admin",
  Super_Admin: "Super_Admin",
  Vendor: "Vendor",
  Delivery_Man: "Delivery_Man",
} as const;

export const UserRoles = Object.values(userRoles);
