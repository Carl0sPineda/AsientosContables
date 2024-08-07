export const currencyFormatter = (amount: any) => {
  const formatter = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  });

  return formatter.format(amount);
};
