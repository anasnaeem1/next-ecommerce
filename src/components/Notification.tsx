"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from "react-icons/fi";

interface NotificationProps {
  message?: string;
  type?: "success" | "error" | "warn";
}

export default function Notification({ message, type }: NotificationProps = {} as NotificationProps) {
  const { notification: contextNotification } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  
  // Use props if provided, otherwise use context
  const notification = message && type 
    ? { type: type.charAt(0).toUpperCase() + type.slice(1) as "Success" | "Error" | "Warn", label: message }
    : contextNotification;

  useEffect(() => {
    if (!notification) return;

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000); // auto-hide after 4s
    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification) return null;

  // black toolbar style with subtle accent colors
  const typeStyles: Record<
    string,
    { icon: React.ReactElement; bg: string; text: string }
  > = {
    Success: {
      icon: <FiCheckCircle />,
      bg: "bg-gray-900",
      text: "text-green-500",
    },
    Error: { icon: <FiXCircle />, bg: "bg-gray-900", text: "text-red-500" },
    Warn: {
      icon: <FiAlertTriangle />,
      bg: "bg-gray-900",
      text: "text-yellow-400",
    },
  };

  const style = typeStyles[notification.type] || typeStyles.Warn;

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2
                flex items-center gap-3 px-3 py-2 rounded-lg
                transition-all duration-300 border border-black ease-out z-[9999]
                ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-6"
                }`}
      style={{
        backgroundColor: "rgba(30,30,30,0.85)",
      }}
    >
      <span
        className="text-2xl"
        style={{
          color:
            notification.type === "Success"
              ? "#22c55e"
              : notification.type === "Error"
              ? "#ef4444"
              : "#facc15",
        }}
      >
        {style.icon}
      </span>
      <span className="font-medium text-gray-100">{notification.label}</span>
    </div>
  );
}
