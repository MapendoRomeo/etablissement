// src/hooks/usePayment.ts
import { useContext } from "react";
import { PaymentContext } from "../contexts/PaymentContext";

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayment must be used within a PaymentProvider");
  return context;
};