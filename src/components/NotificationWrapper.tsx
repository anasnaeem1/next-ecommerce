import { cookies } from "next/headers";
import Notification from "./Notification";

export default async function NotificationWrapper() {
  const cookieStore = await cookies();
  const notification = cookieStore.get("notification")?.value;

  if (!notification) return null;

  if (notification === "review:success") {
    return (
      <Notification
        message="✅ Review submitted successfully!"
        type="success"
      />
    );
  }

  if (notification === "review:error") {
    return (
      <Notification
        message="❌ Failed to submit review. Please try again."
        type="error"
      />
    );
  }

  return null;
}
