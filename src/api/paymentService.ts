// src/api/paymentService.ts
import axios from "./axios";
import { Payment, PaymentFilterParams } from "../types/payment";

export const getPayments = async (filters: PaymentFilterParams): Promise<Payment[]> => {
  const res = await axios.get("/payments", { params: filters });
  return res.data;
};

export const makePayment = async (data: Partial<Payment>) => {
  const res = await axios.post("/payments", data);
  return res.data;
};

export const generatePaymentPDF = async (paymentId: string) => {
  const res = await axios.get(`/payments/${paymentId}/pdf`, { responseType: "blob" });
  return res.data;
};

export const getAllPayments = async (): Promise<Payment[]> => {
  const res = await axios.get("/payments/all");
  return res.data;
};
