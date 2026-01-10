export const formatPriceWithCurrency = (price: string, currency: string = '€') => {
  return `${Number(price)
    .toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(',', '.')} ${currency}`;
};
