"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import MiniCartModal from "./modals/MiniCartModal";

const CartModalWrapper = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Check if viewCart flag is in URL
  useEffect(() => {
    const viewCart = searchParams.get("viewCart");
    setIsOpen(viewCart === "true");
  }, [searchParams]);

  // Close handler - removes viewCart from URL
  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("viewCart");
    const newUrl = params.toString() 
      ? `${pathname}?${params.toString()}` 
      : pathname;
    router.push(newUrl);
    setIsOpen(false);
  };

  return (
    <MiniCartModal
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
};

export default CartModalWrapper;

