import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "../api/axios";

interface ExchangeRateContextType {
  rate: number | null;
  fetchRate: () => Promise<void>;
}

export const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(undefined);

export const ExchangeRateProvider = ({ children }: { children: ReactNode }) => {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    fetchRate();
  }, []);

  const fetchRate = async () => {
    try {
      const res = await axios.get("/exchange-rate/current");
      setRate(res.data.rate);
    } catch (err) {
    }
  };

  return (
    <ExchangeRateContext.Provider value={{ rate, fetchRate }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (!context) throw new Error("useExchangeRate must be used within ExchangeRateProvider");
  return context;
};
