import mongoose from "mongoose";
import Trip from "../models/Trip.js";
import syncItinerary from "../utils/syncItinerary.js";

// Find a trip by id AND make sure it belongs to the logged-in user.
// Sends the error response itself and returns null if something is wrong.
const getOwnedTrip = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid trip id" });
    return null;
  }

  const trip = await Trip.findById(id);

  if (!trip) {
    res.status(404).json({ message: "Trip not found" });
    return null;
  }
  if (trip.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "Not allowed to access this trip" });
    return null;
  }
  return trip;
};

// Only these fields can be set from the request body
const pickTripFields = (body) => {
  const allowed = ["title", "description", "startDate", "endDate", "totalBudget"];
  const data = {};
  allowed.forEach((key) => {
    if (body[key] !== undefined) data[key] = body[key];
  });
  return data;
};

// GET /api/trips
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ startDate: 1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/trips
export const createTrip = async (req, res) => {
  try {
    const trip = new Trip({
      ...pickTripFields(req.body),
      user: req.user._id,
    });
    syncItinerary(trip);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0].message;
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/trips/:id
export const getTrip = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    if (syncItinerary(trip)) await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/trips/:id
export const updateTrip = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    trip.set(pickTripFields(req.body));
    syncItinerary(trip);
    const updated = await trip.save(); // runs validation
    res.json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0].message;
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/trips/:id
export const deleteTrip = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    await trip.deleteOne();
    res.json({ message: "Trip deleted", id: trip._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// POST /api/trips/:id/destinations
export const addDestination = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const { name, country, notes } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Destination name is required" });
    }

    trip.destinations.push({ name, country, notes });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/trips/:id/destinations/:destId
export const updateDestination = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const destination = trip.destinations.id(req.params.destId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const { name, country, notes } = req.body;
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "Destination name is required" });
    }

    if (name !== undefined) destination.name = name;
    if (country !== undefined) destination.country = country;
    if (notes !== undefined) destination.notes = notes;

    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/trips/:id/destinations/:destId
export const deleteDestination = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const destination = trip.destinations.id(req.params.destId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    destination.deleteOne();
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Shared error response for the activity endpoints
const sendError = (res, error) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)[0].message;
    return res.status(400).json({ message });
  }
  res.status(500).json({ message: "Server error", error: error.message });
};

const pickActivityFields = (body) => {
  const allowed = ["time", "title", "location", "cost", "notes"];
  const data = {};
  allowed.forEach((key) => {
    if (body[key] !== undefined) data[key] = body[key];
  });
  if (data.cost !== undefined) data.cost = Number(data.cost) || 0;
  return data;
};

// POST /api/trips/:id/itinerary/:dayId/activities
export const addActivity = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const day = trip.itinerary.id(req.params.dayId);
    if (!day) return res.status(404).json({ message: "Day not found" });

    const data = pickActivityFields(req.body);
    if (!data.title || !data.title.trim()) {
      return res.status(400).json({ message: "Activity title is required" });
    }

    day.activities.push(data);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    sendError(res, error);
  }
};

// PUT /api/trips/:id/itinerary/:dayId/activities/:actId
export const updateActivity = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const day = trip.itinerary.id(req.params.dayId);
    if (!day) return res.status(404).json({ message: "Day not found" });

    const activity = day.activities.id(req.params.actId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const data = pickActivityFields(req.body);
    if (data.title !== undefined && !data.title.trim()) {
      return res.status(400).json({ message: "Activity title is required" });
    }

    activity.set(data);
    await trip.save();
    res.json(trip);
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE /api/trips/:id/itinerary/:dayId/activities/:actId
export const deleteActivity = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const day = trip.itinerary.id(req.params.dayId);
    if (!day) return res.status(404).json({ message: "Day not found" });

    const activity = day.activities.id(req.params.actId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.deleteOne();
    await trip.save();
    res.json(trip);
  } catch (error) {
    sendError(res, error);
  }
};
const pickExpenseFields = (body) => {
  const allowed = ["category", "amount", "description", "date"];
  const data = {};
  allowed.forEach((key) => {
    if (body[key] !== undefined) data[key] = body[key];
  });
  if (data.amount !== undefined) data.amount = Number(data.amount);
  if (data.date === "") delete data.date; // let the default (today) apply
  return data;
};

const isValidAmount = (amount) => Number.isFinite(amount) && amount > 0;

// POST /api/trips/:id/expenses
export const addExpense = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const data = pickExpenseFields(req.body);
    if (!isValidAmount(data.amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be a number greater than 0" });
    }

    trip.expenses.push(data);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    sendError(res, error);
  }
};

// PUT /api/trips/:id/expenses/:expId
export const updateExpense = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const expense = trip.expenses.id(req.params.expId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const data = pickExpenseFields(req.body);
    if (data.amount !== undefined && !isValidAmount(data.amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be a number greater than 0" });
    }

    expense.set(data);
    await trip.save();
    res.json(trip);
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE /api/trips/:id/expenses/:expId
export const deleteExpense = async (req, res) => {
  try {
    const trip = await getOwnedTrip(req, res);
    if (!trip) return;

    const expense = trip.expenses.id(req.params.expId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.deleteOne();
    await trip.save();
    res.json(trip);
  } catch (error) {
    sendError(res, error);
  }
};