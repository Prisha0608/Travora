export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Number of days in a trip, counting both start and end day
export const getTripDays = (start, end) => {
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
};

// Converts an ISO date to "yyyy-mm-dd" for <input type="date">
export const toInputDate = (date) => new Date(date).toISOString().slice(0, 10);

export const formatCurrency = (amount) =>
  "₹" + Number(amount || 0).toLocaleString("en-IN");

export const isUpcoming = (endDate) => new Date(endDate) >= new Date();