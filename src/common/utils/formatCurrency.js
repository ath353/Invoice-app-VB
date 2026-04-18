
export const formatVND = (amount) => {
  const value = Number(amount);

  if (amount == null || Number.isNaN(value)) {
    return "0 \u0111";
  }

  return `${value.toLocaleString("vi-VN")} \u0111`;
};

export const parseVND = (str) => {
  if (str == null) {
    return 0;
  }

  if (typeof str === "number") {
    return Number.isNaN(str) ? 0 : str;
  }

  if (typeof str !== "string") {
    return 0;
  }

  const normalized = str.replace(/[^\d-]/g, "");
  const value = Number(normalized);

  return Number.isNaN(value) ? 0 : value;
};
