export function money(n: number) {
  return (
    "$" +
    n.toLocaleString("es-BO", {
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

export function discount(price: number, old?: number) {
  if (!old || old <= price) return 0;
  return Math.round((1 - price / old) * 100);
}
