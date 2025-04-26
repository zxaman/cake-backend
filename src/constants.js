export const DB_NAME = "Cake";

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000;

export const UserRolesEnum = Object.freeze({
  ADMIN: "Admin",
  APPLICATION_ADMIN: "Application-Admin",
  USER: "User",
});
export const UserStatusEnum = Object.freeze({
  ACTIVE: "Active",
  INACTIVE: "Inactive",
});
export const GenderEnum = Object.freeze({
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
});

export const SchemaNameEnum = Object.freeze({
  USER: "users",
  PRODUCT: "products",
  CART: "carts",
  ORDER: "orders",
  CATEGORY:"categories"
});
