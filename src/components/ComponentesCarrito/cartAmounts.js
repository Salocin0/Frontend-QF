export const cartAmounts = (products) => {
  const subtotalCents = products.reduce((sum, item) => sum + Math.round(Number(item.producto.precio) * 100) * Number(item.cantidad), 0);
  const commissionCents = Math.round(subtotalCents * 15 / 100);
  return { subtotal: subtotalCents / 100, commission: commissionCents / 100, total: (subtotalCents + commissionCents) / 100 };
};
