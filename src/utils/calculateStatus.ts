export const getPaymentStatus = (amountPaid: number, amountDue: number): "en ordre" | "en retard" => {
    return amountPaid >= amountDue ? "en ordre" : "en retard";
  };
  