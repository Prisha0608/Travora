
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import "./DestinationsTab.css";

const emptyForm = { name: "", country: "", notes: "" };

const DestinationsTab = ({ trip, onTripUpdate }) => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let res;

      if (editingId) {
        res = await api.put(
          `/trips/${trip._id}/destinations/${editingId}`,
          form
        );
        toast.success("Destination updated");
      } else {
        res = await api.post(`/trips/${trip._id}/destinations`, form);
        toast.success("Destination added");
      }

      onTripUpdate(res.data);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (dest) => {
    setEditingId(dest._id);
    setForm({
      name: dest.name,
      country: dest.country || "",
      notes: dest.notes || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (destId) => {
    if (!window.confirm("Remove this destination?")) return;

    try {
      const res = await api.delete(
        `/trips/${trip._id}/destinations/${destId}`
      );

      onTripUpdate(res.data);

      if (editingId === destId) resetForm();

      toast.success("Destination removed");
    } catch {
      toast.error("Could not remove destination");
    }
  };

  return (
    <div className="destinations-tab">
      <div className="destinations-heading">
        <span className="destinations-eyebrow">YOUR TRAVEL JOURNEY</span>
        <h2>Explore Your Destinations</h2>
        <p>Every destination has a story waiting to be discovered.</p>
      </div>

      <form className="dest-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit destination" : "Add a destination"}</h3>

        <div className="dest-form-row">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Place name (e.g. Baga Beach)"
            required
          />

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
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
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Save changes"
              : "+ Add destination"}
          </button>
        </div>
      </form>

      {trip.destinations.length === 0 ? (
        <div className="dest-empty">
          <div className="dest-empty-icon">📍</div>
          <h3>Your journey starts here!</h3>
          <p className="muted">
            No destinations yet. Add the first place you want to visit.
          </p>
        </div>
      ) : (
        <div className="dest-list">
          {trip.destinations.map((dest, index) => (
            <div className="dest-item" key={dest._id}>
              <div className="dest-number">{index + 1}</div>

              <div className="dest-info">
                <h4>{dest.name}</h4>

                {dest.country && (
                  <span className="dest-country">
                    📍 {dest.country}
                  </span>
                )}

                {dest.notes && <p>{dest.notes}</p>}
              </div>

              <div className="dest-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => startEdit(dest)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(dest._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationsTab;
