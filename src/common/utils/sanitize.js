
const ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const sanitizeText = (str) => {
  if (typeof str !== "string") {
    return "";
  }

  return str.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);
};
