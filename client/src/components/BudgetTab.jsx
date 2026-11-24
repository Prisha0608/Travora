import { useState } from "react";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";
import { formatCurrency, formatDate, toInputDate } from "../utils/helpers";
import "./BudgetTab.css";

const CATEGORIES = {
  stay: { label: "Stay", icon: "🏨", color: "#0d9488" },
  food: { label: "Food", icon: "🍽", color: "#f97316" },
  transport: { label: "Transport", icon: "🚕", color: "#0369a1" },
  activities: { label: "Activities", icon: "🎟", color: "#8b5cf6" },
  shopping: { label: "Shopping", icon: "🛍", color: "#ec4899" },
  other: { label: "Other", icon: "📦", color: "#64748b" },
};

const today = () => new Date().toISOString().slice(0, 10);

const makeEmptyForm = () => ({
  category: "food",
  amount: "",
  description: "",
  date: today(),
});

// Bar color depends on how much of the budget is used
const barColor = (pct) => (pct >= 100 ? "#dc2626" : pct >= 80 ? "#f97316" : "#0d9488");

const BudgetTab = ({ trip, onTripUpdate }) => {
  const [form, setForm] = useState(makeEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const expensesUrl = `/trips/${trip._id}/expenses`;

  // ---- Calculations ----
  const budget = trip.totalBudget || 0;
  const planned = trip.itinerary.reduce(
    (sum, day) => sum + day.activities.reduce((s, a) => s + (a.cost || 0), 0),
    0
  );
  const spent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - spent;

  const spentPct = budget > 0 ? (spent / budget) * 100 : 0;
  const plannedPct = budget > 0 ? (planned / budget) * 100 : 0;

  // Totals per category, for the chart (only categories with spending)
  const chartData = Object.keys(CATEGORIES)
    .map((key) => ({
      key,
      name: CATEGORIES[key].label,
      value: trip.expenses
        .filter((e) => e.category === key)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((item) => item.value > 0);

  // Newest expense first
  const sortedExpenses = [...trip.expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // ---- Form handlers ----
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(makeEmptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      let res;
      if (editingId) {
        res = await api.put(`${expensesUrl}/${editingId}`, payload);
        toast.success("Expense updated");
      } else {
        res = await api.post(expensesUrl, payload);
        toast.success("Expense added");
      }
      onTripUpdate(res.data);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      category: expense.category,
      amount: expense.amount,
      description: expense.description || "",
      date: toInputDate(expense.date),
    });
  };

  const handleDelete = async (expId) => {
    if (!window.confirm("Remove this expense?")) return;
    try {
      const res = await api.delete(`${expensesUrl}/${expId}`);
      onTripUpdate(res.data);
      if (editingId === expId) resetForm();
      toast.success("Expense removed");
    } catch {
      toast.error("Could not remove expense");
    }
  };

  return (
    <div>
      {/* Summary cards */}
      <div className="budget-cards">
        <div className="details-box">
          <span className="muted">Budget</span>
          <strong>{formatCurrency(budget)}</strong>
        </div>
        <div className="details-box">
          <span className="muted">Planned (itinerary)</span>
          <strong>{formatCurrency(planned)}</strong>
        </div>
        <div className="details-box">
          <span className="muted">Spent</span>
          <strong>{formatCurrency(spent)}</strong>
        </div>
        <div className="details-box">
          <span className="muted">{remaining < 0 ? "Over budget" : "Remaining"}</span>
          <strong className={remaining < 0 ? "over" : "under"}>
            {formatCurrency(Math.abs(remaining))}
          </strong>
        </div>
      </div>

      {/* Progress bars */}
      <div className="budget-bars">
        {budget > 0 ? (
          <>
            <div className="bar-row">
              <div className="bar-label">
                <span>Spent</span>
                <span>{Math.round(spentPct)}% of budget</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.min(100, spentPct)}%`,
                    background: barColor(spentPct),
                  }}
                />
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-label">
                <span>Planned</span>
                <span>{Math.round(plannedPct)}% of budget</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.min(100, plannedPct)}%`,
                    background: barColor(plannedPct),
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="muted">
            Set a total budget by editing the trip to see progress bars.
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="chart-box">
        <h3>Spending by category</h3>
        {chartData.length === 0 ? (
          <p className="muted">Add an expense to see the chart 📊</p>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {chartData.map((item) => (
                    <Cell key={item.key} fill={CATEGORIES[item.key].color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Form */}
      <form className="dest-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit expense" : "Log an expense"}</h3>

        <div className="exp-form-row">
          <select name="category" value={form.category} onChange={handleChange}>
            {Object.entries(CATEGORIES).map(([key, c]) => (
              <option key={key} value={key}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount (₹)"
            min="1"
            step="any"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (e.g. Taxi to airport)"
        />

        <div className="dest-form-actions">
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save changes" : "+ Add expense"}
          </button>
        </div>
      </form>

      {/* Expense list */}
      {sortedExpenses.length === 0 ? (
        <div className="dest-empty">
          <p className="muted">No expenses logged yet 💸</p>
        </div>
      ) : (
        <div className="dest-list">
          {sortedExpenses.map((exp) => {
            const cat = CATEGORIES[exp.category] || CATEGORIES.other;
            return (
              <div className="dest-item" key={exp._id}>
                <div
                  className="exp-icon"
                  style={{ background: cat.color + "22", color: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className="dest-info">
                  <h4>{exp.description || cat.label}</h4>
                  <span className="dest-country">
                    {cat.label} · {formatDate(exp.date)}
                  </span>
                </div>
                <div className="exp-amount">{formatCurrency(exp.amount)}</div>
                <div className="dest-actions">
                  <button className="btn btn-outline" onClick={() => startEdit(exp)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(exp._id)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetTab;