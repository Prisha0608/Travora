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

export default router;