/**
 * User Types
 */

export type User = {
  id?: string | null;
  name: string | null;
  email: string | null;
  imageUrl?: string | null;
  image?: string | null;
  Cart?: string | null;
};

export type UserType = User | null;

export type UserWithCart = {
  _id?: string | null;
  id?: string | null;
  name: string | null;
  email: string | null;
  imageUrl?: string | null;
  image?: string | null;
  cart?: import("./cart").CartType | null;
};

