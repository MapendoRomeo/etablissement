export const formatCurrency = (amount: number, currency: "USD" | "CDF" = "USD") => {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  