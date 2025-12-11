/**
 * Session Types
 */

export type SessionType = {
  _id: string;
  userId: string;
  secret: string;
  expiresAt: Date | string;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

