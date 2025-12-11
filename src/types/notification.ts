/**
 * Notification Types
 */

export type NotificationType =
  | {
      type: "Success" | "Error" | "Warn";
      label: string;
    }
  | null;

