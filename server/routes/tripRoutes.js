import express from "express";
import {
  getTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // every trip route requires login

router.route("/").get(getTrips).post(createTrip);
router.route("/:id").get(getTrip).put(updateTrip).delete(deleteTrip);

export default router;