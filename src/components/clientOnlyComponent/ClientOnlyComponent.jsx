"use client";
import { useState, useEffect } from "react";

const ClientOnlyComponent = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering until mounted
  }

  return <>{children}</>;
};

export default ClientOnlyComponent;
