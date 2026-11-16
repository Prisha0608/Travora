import mongoose from "mongoose";
import Trip from "../models/Trip.js";

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
    const trip = await Trip.create({
      ...pickTripFields(req.body),
      user: req.user._id,
    });
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