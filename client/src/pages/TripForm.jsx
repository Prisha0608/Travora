import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { toInputDate } from "../utils/helpers";
import "./TripForm.css";

const emptyForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  totalBudget: "",
};

const TripForm = () => {
  const { id } = useParams(); // present only on the edit route
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // In edit mode, load the existing trip into the form
  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/trips/${id}`)
      .then(({ data }) =>
        setForm({
          title: data.title,
          description: data.description || "",
          startDate: toInputDate(data.startDate),
          endDate: toInputDate(data.endDate),
          totalBudget: data.totalBudget,
        })
      )
      .catch(() => {
        toast.error("Trip not found");
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.endDate < form.startDate) {
      return toast.error("End date cannot be before start date");
    }

    setSubmitting(true);
    try {
      const payload = { ...form, totalBudget: Number(form.totalBudget) || 0 };
      if (isEdit) {
        await api.put(`/trips/${id}`, payload);
        toast.success("Trip updated");
        navigate(`/trips/${id}`);
      } else {
        const { data } = await api.post("/trips", payload);
        toast.success("Trip created");
        navigate(`/trips/${data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <>
      <Navbar />
      <main className="page">
        <form className="form-card" onSubmit={handleSubmit}>
          <h1>{isEdit ? "Edit trip" : "Create a new trip"}</h1>

          <label>Trip title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Goa Beach Holiday"
            maxLength={100}
            required
          />

          <div className="form-row">
            <div>
              <label>Start date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>End date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Total budget (₹)</label>
          <input
            type="number"
            name="totalBudget"
            value={form.totalBudget}
            onChange={handleChange}
            placeholder="e.g. 30000"
            min="0"
          />

          <label>Description (optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What's this trip about?"
            rows={3}
            maxLength={500}
          />

          <div className="form-actions">
            <Link to={isEdit ? `/trips/${id}` : "/dashboard"} className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-accent" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create trip"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default TripForm;