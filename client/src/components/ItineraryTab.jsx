import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { formatCurrency, formatDayDate, formatTime } from "../utils/helpers";
import "./ItineraryTab.css";

const emptyForm = { time: "", title: "", location: "", cost: "", notes: "" };

const dayCost = (day) =>
  day.activities.reduce((sum, a) => sum + (a.cost || 0), 0);

// Sort by time; activities without a time go last
const sortByTime = (activities) =>
  [...activities].sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

const ItineraryTab = ({ trip, onTripUpdate }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fall back to the first day if nothing is selected yet
  const day =
    trip.itinerary.find((d) => d._id === selectedId) || trip.itinerary[0];

  if (!day) {
    return (
      <div className="dest-empty">
        <p className="muted">No days found for this trip.</p>
      </div>
    );
  }

  const plannedTotal = trip.itinerary.reduce((sum, d) => sum + dayCost(d), 0);
  const activitiesUrl = `/trips/${trip._id}/itinerary/${day._id}/activities`;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const selectDay = (id) => {
    setSelectedId(id);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, cost: Number(form.cost) || 0 };
      let res;
      if (editingId) {
        res = await api.put(`${activitiesUrl}/${editingId}`, payload);
        toast.success("Activity updated");
      } else {
        res = await api.post(activitiesUrl, payload);
        toast.success("Activity added");
      }
      onTripUpdate(res.data);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (activity) => {
    setEditingId(activity._id);
    setForm({
      time: activity.time || "",
      title: activity.title,
      location: activity.location || "",
      cost: activity.cost || "",
      notes: activity.notes || "",
    });
  };

  const handleDelete = async (actId) => {
    if (!window.confirm("Remove this activity?")) return;
    try {
      const res = await api.delete(`${activitiesUrl}/${actId}`);
      onTripUpdate(res.data);
      if (editingId === actId) resetForm();
      toast.success("Activity removed");
    } catch {
      toast.error("Could not remove activity");
    }
  };

  return (
    <div>
      <div className="it-summary">
        <span>Planned activity cost</span>
        <strong>{formatCurrency(plannedTotal)}</strong>
        <span className="muted">
          of {formatCurrency(trip.totalBudget)} budget
        </span>
      </div>

      <div className="day-pills">
        {trip.itinerary.map((d) => (
          <button
            key={d._id}
            className={`day-pill ${d._id === day._id ? "day-pill-active" : ""}`}
            onClick={() => selectDay(d._id)}
          >
            <strong>Day {d.dayNumber}</strong>
            <span>{formatDayDate(d.date)}</span>
          </button>
        ))}
      </div>

      <div className="day-header">
        <h3>
          Day {day.dayNumber} · {formatDayDate(day.date)}
        </h3>
        <span className="day-cost">{formatCurrency(dayCost(day))}</span>
      </div>

      <form className="dest-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit activity" : "Add an activity"}</h3>

        <div className="act-form-row">
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
          />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What are you doing? (e.g. Visit fort)"
            required
          />
        </div>

        <div className="act-form-row">
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="Cost (₹)"
            min="0"
          />
        </div>

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          rows={2}
        />

        <div className="dest-form-actions">
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save changes" : "+ Add activity"}
          </button>
        </div>
      </form>

      {day.activities.length === 0 ? (
        <div className="dest-empty">
          <p className="muted">Nothing planned for this day yet 🗓</p>
        </div>
      ) : (
        <div className="timeline">
          {sortByTime(day.activities).map((a) => (
            <div className="timeline-item" key={a._id}>
              <div className="timeline-time">{formatTime(a.time)}</div>
              <div className="timeline-card">
                <div className="timeline-top">
                  <h4>{a.title}</h4>
                  {a.cost > 0 && (
                    <span className="timeline-cost">{formatCurrency(a.cost)}</span>
                  )}
                </div>
                {a.location && <p className="dest-country">📍 {a.location}</p>}
                {a.notes && <p className="timeline-notes">{a.notes}</p>}
                <div className="dest-actions">
                  <button className="btn btn-outline" onClick={() => startEdit(a)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(a._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryTab;