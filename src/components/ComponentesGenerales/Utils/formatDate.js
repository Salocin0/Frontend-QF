// Date-only values (event days, pre-purchase dates) are stored as UTC instants; formatting them in the
// browser timezone shifts them one day back in UTC-3. Always format them in UTC with a fixed dd/mm/yyyy layout.
export const formatDateAR = (value, options = {}) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-AR", { timeZone: "UTC", ...options });
};
