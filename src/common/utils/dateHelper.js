export const formatDate = (dateStr) => {
  if (!dateStr) {
    return "";
  }

  const source = String(dateStr).split("T")[0];
  const [year, month, day] = source.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}/${year}`;
};

export const toInputDate = (dateStr) => {
  if (!dateStr) {
    return "";
  }

  return String(dateStr).split("T")[0];
};

export const getTodayInputValue = () => {
  return new Date().toISOString().slice(0, 10);
};

export const isValidDate = (str) => {
  if (typeof str !== "string") {
    return false;
  }

  const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1) {
    return false;
  }

  const maxDay = new Date(year, month, 0).getDate();
  return day <= maxDay;
};
