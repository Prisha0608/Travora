
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
import {
  formatCurrency,
  formatDate,
  toInputDate,
} from "../utils/helpers";

import "./BudgetTab.css";

const CATEGORIES = {
  stay: { label: "Stay", icon: "🏨", color: "#0d9488" },
  food: { label: "Food", icon: "🍽️", color: "#f97316" },
  transport: { label: "Transport", icon: "🚕", color: "#0369a1" },
  activities: { label: "Activities", icon: "🎟️", color: "#8b5cf6" },
  shopping: { label: "Shopping", icon: "🛍️", color: "#ec4899" },
  other: { label: "Other", icon: "📦", color: "#64748b" },
};

const today = () => new Date().toISOString().slice(0, 10);

const makeEmptyForm = () => ({
  category: "food",
  amount: "",
  description: "",
  date: today(),
});

const barColor = (pct) =>
  pct >= 100 ? "#dc2626" : pct >= 80 ? "#f97316" : "#0d9488";

const BudgetTab = ({ trip, onTripUpdate }) => {
  const [form, setForm] = useState(makeEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const expensesUrl = `/trips/${trip._id}/expenses`;

  const itinerary = trip.itinerary || [];
  const expenses = trip.expenses || [];

  const budget = Number(trip.totalBudget) || 0;

  const planned = itinerary.reduce(
    (sum, day) =>
      sum +
      (day.activities || []).reduce(
        (activitySum, activity) =>
          activitySum + (Number(activity.cost) || 0),
        0
      ),
    0
  );

  const spent = expenses.reduce(
    (sum, expense) =>
      sum + (Number(expense.amount) || 0),
    0
  );

  const remaining = budget - spent;

  const spentPct = budget > 0 ? (spent / budget) * 100 : 0;
  const plannedPct = budget > 0 ? (planned / budget) * 100 : 0;

  const chartData = Object.keys(CATEGORIES)
    .map((key) => ({
      key,
      name: CATEGORIES[key].label,
      value: expenses
        .filter((expense) => expense.category === key)
        .reduce(
          (sum, expense) =>
            sum + (Number(expense.amount) || 0),
          0
        ),
    }))
    .filter((item) => item.value > 0);

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(makeEmptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      let res;

      if (editingId) {
        res = await api.put(
          `${expensesUrl}/${editingId}`,
          payload
        );
        toast.success("Expense updated");
      } else {
        res = await api.post(expensesUrl, payload);
        toast.success("Expense added");
      }

      onTripUpdate(res.data);
      resetForm();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense._id);

    setForm({
      category: expense.category || "other",
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

      if (editingId === expId) {
        resetForm();
      }

      toast.success("Expense removed");
    } catch {
      toast.error("Could not remove expense");
    }
  };

  return (
    <div className="budget-tab">

      {/* Heading */}
      <div className="budget-section-heading">
        <div>
          <span className="budget-eyebrow">OVERVIEW</span>
          <h3>Your budget summary</h3>
        </div>
        <span className="budget-heading-icon">💰</span>
      </div>

      {/* Summary Cards */}
      <div className="budget-cards">

        <div className="budget-stat-card">
          <div className="budget-stat-top">
            <span className="budget-stat-icon teal">💳</span>
            <span>Total budget</span>
          </div>
          <strong>{formatCurrency(budget)}</strong>
        </div>

        <div className="budget-stat-card">
          <div className="budget-stat-top">
            <span className="budget-stat-icon purple">📋</span>
            <span>Planned</span>
          </div>
          <strong>{formatCurrency(planned)}</strong>
        </div>

        <div className="budget-stat-card">
          <div className="budget-stat-top">
            <span className="budget-stat-icon orange">💸</span>
            <span>Spent</span>
          </div>
          <strong>{formatCurrency(spent)}</strong>
        </div>

        <div className="budget-stat-card">
          <div className="budget-stat-top">
            <span className="budget-stat-icon green">🏦</span>
            <span>{remaining < 0 ? "Over budget" : "Remaining"}</span>
          </div>
          <strong className={remaining < 0 ? "over" : "under"}>
            {formatCurrency(Math.abs(remaining))}
          </strong>
        </div>

      </div>

      {/* Budget Progress */}
      <div className="budget-panel">

        <div className="budget-panel-heading">
          <div>
            <span className="budget-eyebrow">TRACKING</span>
            <h3>Budget progress</h3>
          </div>
          <span className="budget-panel-icon">📊</span>
        </div>

        {budget > 0 ? (
          <div className="budget-bars">

            <div className="bar-row">
              <div className="bar-label">
                <span>Actual spending</span>
                <strong>{Math.round(spentPct)}%</strong>
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

              <p className="budget-progress-caption">
                {formatCurrency(spent)} spent out of {formatCurrency(budget)}
              </p>
            </div>

            <div className="bar-row">
              <div className="bar-label">
                <span>Planned expenses</span>
                <strong>{Math.round(plannedPct)}%</strong>
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

              <p className="budget-progress-caption">
                {formatCurrency(planned)} planned out of {formatCurrency(budget)}
              </p>
            </div>

          </div>
        ) : (
          <p className="muted">
            Set a total budget by editing your trip to see progress.
          </p>
        )}

      </div>

      {/* Spending Chart */}
      <div className="budget-panel budget-chart-panel">

        <div className="budget-panel-heading">
          <div>
            <span className="budget-eyebrow">ANALYTICS</span>
            <h3>Spending by category</h3>
          </div>
          <span className="budget-panel-icon">🥧</span>
        </div>

        {chartData.length === 0 ? (
          <div className="budget-chart-empty">
            <span>📊</span>
            <h4>No spending data yet</h4>
            <p>Add your first expense to see your spending breakdown.</p>
          </div>
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
                  paddingAngle={3}
                >
                  {chartData.map((item) => (
                    <Cell
                      key={item.key}
                      fill={CATEGORIES[item.key].color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* Expense Form */}
      <form
        className="budget-panel budget-expense-form"
        onSubmit={handleSubmit}
      >

        <div className="budget-panel-heading">
          <div>
            <span className="budget-eyebrow">EXPENSE MANAGER</span>
            <h3>{editingId ? "Edit expense" : "Log an expense"}</h3>
          </div>
          <span className="budget-panel-icon">✍️</span>
        </div>

        <div className="exp-form-row">

          <div className="exp-form-group">
            <label htmlFor="expense-category">Category</label>
            <select
              id="expense-category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {Object.entries(CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="exp-form-group">
            <label htmlFor="expense-amount">Amount (₹)</label>
            <input
              id="expense-amount"
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              step="any"
              required
            />
          </div>

          <div className="exp-form-group">
            <label htmlFor="expense-date">Date</label>
            <input
              id="expense-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <div className="exp-form-group">
          <label htmlFor="expense-description">Description</label>
          <input
            id="expense-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Taxi to airport"
          />
        </div>

        <div className="budget-form-actions">

          {editingId && (
            <button
              type="button"
              className="budget-btn budget-btn-cancel"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="budget-btn budget-btn-primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Save changes"
              : "+ Add expense"}
          </button>

        </div>

      </form>

      {/* Expense List */}
      <div className="budget-list-heading">
        <div>
          <span className="budget-eyebrow">YOUR TRANSACTIONS</span>
          <h3>Recent expenses</h3>
        </div>

        <span className="budget-expense-count">
          {sortedExpenses.length} expenses
        </span>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="budget-panel budget-empty">
          <span>🧳</span>
          <h4>Your expense list is empty</h4>
          <p>Start logging your travel expenses to keep everything organized.</p>
        </div>
      ) : (
        <div className="budget-expense-list">

          {sortedExpenses.map((exp) => {
            const cat = CATEGORIES[exp.category] || CATEGORIES.other;

            return (
              <div className="budget-expense-item" key={exp._id}>

                <div
                  className="budget-expense-icon"
                  style={{
                    background: `${cat.color}22`,
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </div>

                <div className="budget-expense-info">
                  <h4>{exp.description || cat.label}</h4>
                  <span>
                    {cat.label} · {formatDate(exp.date)}
                  </span>
                </div>

                <strong className="budget-expense-amount">
                  {formatCurrency(exp.amount)}
                </strong>

                <div className="budget-expense-actions">

                  <button
                    type="button"
                    className="budget-btn budget-btn-edit"
                    onClick={() => startEdit(exp)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="budget-btn budget-btn-delete"
                    onClick={() => handleDelete(exp._id)}
                  >
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
