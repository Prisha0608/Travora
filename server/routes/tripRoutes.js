import express from "express";
import {
  getTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  addDestination,
  updateDestination,
  deleteDestination,
  addActivity, 
  updateActivity, 
  deleteActivity,
  addExpense, updateExpense, deleteExpense,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // every trip route requires login

router.route("/").get(getTrips).post(createTrip);
router.route("/:id").get(getTrip).put(updateTrip).delete(deleteTrip);
router.post("/:id/destinations", addDestination);
router
  .route("/:id/destinations/:destId")
  .put(updateDestination)
  .delete(deleteDestination);

router.post("/:id/itinerary/:dayId/activities", addActivity);
router
  .route("/:id/itinerary/:dayId/activities/:actId")
  .put(updateActivity)
  .delete(deleteActivity);

router.post("/:id/expenses", addExpense);
router
  .route("/:id/expenses/:expId")
  .put(updateExpense)
  .delete(deleteExpense);

export default router;