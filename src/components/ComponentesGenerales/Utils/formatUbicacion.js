// Builds "ubicacion, localidad, provincia" without repeating parts that the free-text
// ubicacion already contains (e.g. "Villa María, Córdoba" + "Villa María" + "Córdoba").
export const formatUbicacion = (evento) => {
  const parts = [evento?.ubicacion, evento?.localidad, evento?.provincia]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  const result = [];
  parts.forEach((part) => {
    const alreadyIncluded = result.some((existing) =>
      existing.toLowerCase().includes(part.toLowerCase())
    );
    if (!alreadyIncluded) result.push(part);
  });

  return result.join(", ");
};
