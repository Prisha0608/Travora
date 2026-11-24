const DAY_MS = 24 * 60 * 60 * 1000;
const dateKey = (d) => new Date(d).toISOString().slice(0, 10); // "2026-12-20"

// Returns true if the itinerary was changed
const syncItinerary = (trip) => {
  // Invalid dates: do nothing, validation will report the problem
  if (!trip.startDate || !trip.endDate || trip.endDate < trip.startDate) {
    return false;
  }

  const start = new Date(trip.startDate);
  const totalDays = Math.round((new Date(trip.endDate) - start) / DAY_MS) + 1;

  // Existing days looked up by their date
  const existing = new Map(trip.itinerary.map((d) => [dateKey(d.date), d]));

  const days = [];
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start.getTime() + i * DAY_MS);
    const old = existing.get(dateKey(date));

    days.push(
      old
        ? {
            _id: old._id,
            dayNumber: i + 1,
            date,
            activities: old.activities.map((a) => a.toObject()),
          }
        : { dayNumber: i + 1, date, activities: [] }
    );
  }

  const changed =
    days.length !== trip.itinerary.length ||
    days.some((d, i) => {
      const current = trip.itinerary[i];
      return (
        dateKey(current.date) !== dateKey(d.date) ||
        current.dayNumber !== d.dayNumber
      );
    });

  if (changed) trip.itinerary = days;
  return changed;
};

export default syncItinerary;