// src/contexts/PaymentContext.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import { Payment } from "../types/payment";
import { getAllPayments } from "../api/paymentService";

interface PaymentContextType {
  payments: Payment[];
  loading: boolean;
  refreshPayments: () => void;
}

export const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getAllPayments();
      setPayments(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <PaymentContext.Provider value={{ payments, loading, refreshPayments: fetchPayments }}>
      {children}
    </PaymentContext.Provider>
  );
};
