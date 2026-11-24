import mongoose from "mongoose";

// Sub-schemas (used in later steps; defined now so the model is complete)
const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, trim: true },
  notes: { type: String, trim: true },
});

const activitySchema = new mongoose.Schema({
  time: { type: String },
  title: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  cost: { type: Number, default: 0, min: 0 },
  notes: { type: String, trim: true },
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: Date },
  activities: [activitySchema],
});

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["stay", "food", "transport", "activities", "shopping", "other"],
    default: "other",
  },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  date: { type: Date, default: Date.now },
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Trip title is required"],
      trim: true,
      maxlength: 100,
    },
    description: { type: String, trim: true, maxlength: 500 },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
    totalBudget: { type: Number, default: 0, min: 0 },
    destinations: [destinationSchema],
    itinerary: [daySchema],
    expenses: [expenseSchema],
  },
  { timestamps: true }
);

// End date must not be before start date

tripSchema.pre("validate", function () {
  if (this.startDate && this.endDate) {
    if (this.endDate < this.startDate) {
      this.invalidate("endDate", "End date cannot be before start date");
    } else if ((this.endDate - this.startDate) / 86400000 > 365) {
      this.invalidate("endDate", "A trip can be at most 365 days long");
    }
  }
});

export default mongoose.model("Trip", tripSchema);