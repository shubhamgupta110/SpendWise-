
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/transactions";
const USER_ID = 1;

const categories = [
  { id: 1, name: "Food", type: "expense" },
  { id: 2, name: "Travel", type: "expense" },
  { id: 3, name: "Shopping", type: "expense" },
  { id: 4, name: "Bills", type: "expense" },
  { id: 5, name: "Salary", type: "income" },
  { id: 6, name: "Other Income", type: "income" },
];

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    type: "expense",
    category_id: "1",
    amount: "",
    description: "",
    transaction_date: getToday(),
  });

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);
      setError("");
    } catch (err) {
      console.error("API Error:", err);
      setError("Unable to load transactions. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate totals
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  // Currency formatting
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  // Filter categories according to transaction type
  const filteredCategories = categories.filter(
    (category) => category.type === form.type
  );

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle expense/income selection
  const handleTypeChange = (event) => {
    const selectedType = event.target.value;

    const firstCategory = categories.find(
      (category) => category.type === selectedType
    );

    setForm((previous) => ({
      ...previous,
      type: selectedType,
      category_id: String(firstCategory.id),
    }));
  };

  // Submit transaction to backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!form.amount || Number(form.amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (!form.description.trim()) {
      setMessage("Please enter a description.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: USER_ID,
          category_id: Number(form.category_id),
          type: form.type,
          amount: Number(form.amount),
          description: form.description.trim(),
          transaction_date: form.transaction_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to save transaction");
      }

      setMessage("Transaction added successfully!");

      setForm({
        type: "expense",
        category_id: "1",
        amount: "",
        description: "",
        transaction_date: getToday(),
      });

      await fetchTransactions();
    } catch (err) {
      console.error("Save Error:", err);
      setMessage(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="spendwise">

      {/* NAVBAR */}
      <header className="navbar">
        <a href="#home" className="logo">
          <span className="logo-icon">S</span>
          SpendWise
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#transactions">Transactions</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <div className="nav-actions">
          <a href="#transactions" className="login-link">Login</a>
          <a href="#transactions" className="signup-btn">Get Started</a>
        </div>
      </header>

      <main>

        {/* HERO SECTION */}
        <section className="hero" id="home">

          <div className="hero-content">
            <span className="eyebrow">
              ✦ YOUR MONEY, YOUR CONTROL
            </span>

            <h1>
              Take Control of
              <br />
              Your Money with
              <br />
              <span>SpendWise.</span>
            </h1>

            <p className="hero-description">
              Track your income, manage expenses, set smart budgets,
              and understand your spending — all in one place.
            </p>

            <div className="hero-buttons">
              <a href="#transactions" className="primary-btn">
                Get Started Free →
              </a>

              <a href="#features" className="secondary-btn">
                Explore Features
              </a>
            </div>

            <div className="trust-row">
              <span>✓ Secure & Private</span>
              <span>✓ Easy to Use</span>
              <span>✓ Clear Insights</span>
            </div>
          </div>

          {/* DASHBOARD VISUAL */}
          <div className="hero-visual">

            <div className="glow"></div>
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="floating-coin coin-one">₹</div>
            <div className="floating-coin coin-two">+</div>
            <div className="floating-coin coin-three">↗</div>

            <div className="floating-card income-card">
              <span className="mini-icon">↗</span>

              <div>
                <small>Total Income</small>
                <strong>
                  {loading ? "Loading..." : formatCurrency(totalIncome)}
                </strong>
              </div>
            </div>

            {/* PHONE DASHBOARD */}
            <div className="phone">

              <div className="phone-top">
                <span>SpendWise</span>
                <span className="profile-dot">S</span>
              </div>

              <div className="balance-card">
                <small>Total Balance</small>

                <h2>
                  {loading ? "Loading..." : formatCurrency(totalBalance)}
                </h2>

                <span className="balance-change">
                  Your financial overview
                </span>

                <div className="chart">
                  <svg
                    viewBox="0 0 260 76"
                    role="img"
                    aria-label="Illustrative spending trend chart"
                  >
                    <defs>
                      <linearGradient
                        id="chartFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#a5f3c7" stopOpacity=".45" />
                        <stop offset="100%" stopColor="#a5f3c7" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 62 L32 49 L60 55 L88 28 L119 39 L148 18 L177 32 L207 10 L235 22 L260 4 L260 76 L0 76 Z"
                      fill="url(#chartFill)"
                    />

                    <path
                      d="M0 62 L32 49 L60 55 L88 28 L119 39 L148 18 L177 32 L207 10 L235 22 L260 4"
                      fill="none"
                      stroke="#a5f3c7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="summary-heading">
                <strong>Financial Overview</strong>
                <span>All Time</span>
              </div>

              <div className="mini-stats">
                <div>
                  <span className="stat-dot green"></span>
                  <small>Income</small>
                  <strong>
                    {loading ? "..." : formatCurrency(totalIncome)}
                  </strong>
                </div>

                <div>
                  <span className="stat-dot orange"></span>
                  <small>Expenses</small>
                  <strong>
                    {loading ? "..." : formatCurrency(totalExpenses)}
                  </strong>
                </div>
              </div>

              <div className="budget-heading">
                <strong>Monthly Budget</strong>
                <span>Coming Soon</span>
              </div>

              <div className="budget-track">
                <div className="budget-fill" style={{ width: "0%" }}></div>
              </div>

              <small className="budget-caption">
                Budget tracking will be available soon!
              </small>

              <div className="summary-heading">
                <strong>Recent Transactions</strong>
                <span>{transactions.length} Total</span>
              </div>

              {loading ? (
                <p>Loading transactions...</p>
              ) : error ? (
                <p>{error}</p>
              ) : transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                transactions.slice(0, 5).map((item) => (
                  <div className="transaction" key={item.id}>
                    <span
                      className={`transaction-icon ${
                        item.type === "income" ? "income-symbol" : ""
                      }`}
                    >
                      {item.type === "income" ? "↙" : "🛒"}
                    </span>

                    <div>
                      <strong>
                        {item.description || item.category}
                      </strong>

                      <small>
                        {item.category} ·{" "}
                        {item.transaction_date
                          ? new Date(item.transaction_date).toLocaleDateString(
                              "en-IN",
                              { timeZone: "UTC" }
                            )
                          : ""}
                      </small>
                    </div>

                    <b className={item.type === "income" ? "positive" : ""}>
                      {item.type === "income" ? "+" : "−"}
                      {formatCurrency(Number(item.amount))}
                    </b>
                  </div>
                ))
              )}

            </div>

            <div className="floating-card expense-card">
              <span className="expense-icon">↘</span>

              <div>
                <small>Expenses</small>
                <strong>
                  {loading ? "Loading..." : formatCurrency(totalExpenses)}
                </strong>
                <em>Live database data</em>
              </div>
            </div>

          </div>
        </section>

        {/* TRANSACTION MANAGER */}
        <section className="transaction-manager" id="transactions">

          <div className="section-heading">
            <span className="eyebrow">MANAGE YOUR MONEY</span>
            <h2>Your Financial Dashboard</h2>
            <p>Track your income and expenses in one place.</p>
          </div>

          {/* SUMMARY CARDS */}
          <div className="dashboard-summary">

            <div className="summary-card">
              <span>Total Balance</span>
              <h3>{formatCurrency(totalBalance)}</h3>
            </div>

            <div className="summary-card">
              <span>Total Income</span>
              <h3 className="positive">{formatCurrency(totalIncome)}</h3>
            </div>

            <div className="summary-card">
              <span>Total Expenses</span>
              <h3 className="negative">{formatCurrency(totalExpenses)}</h3>
            </div>

          </div>

          <div className="transaction-layout">

            {/* ADD TRANSACTION FORM */}
            <div className="transaction-panel">

              <h3>Add New Transaction</h3>
              <p>Enter your income or expense details.</p>

              <form className="transaction-form" onSubmit={handleSubmit}>

                <div className="form-group">
                  <label htmlFor="type">Transaction Type</label>

                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={handleTypeChange}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category_id">Category</label>

                  <select
                    id="category_id"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                  >
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount (₹)</label>

                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>

                  <input
                    id="description"
                    type="text"
                    name="description"
                    placeholder="Example: Lunch, Salary, Shopping"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="transaction_date">Date</label>

                  <input
                    id="transaction_date"
                    type="date"
                    name="transaction_date"
                    value={form.transaction_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Add Transaction"}
                </button>

                {message && (
                  <p className="form-message">{message}</p>
                )}

              </form>
            </div>

            {/* RECENT TRANSACTIONS LIST */}
            <div className="transaction-panel">

              <h3>Recent Transactions</h3>
              <p>Your latest financial activities.</p>

              {loading ? (
                <p>Loading transactions...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : transactions.length === 0 ? (
                <p>No transactions available. Add your first transaction.</p>
              ) : (
                <div className="recent-list">

                  {transactions.slice(0, 10).map((item) => (
                    <div className="recent-item" key={item.id}>

                      <div>
                        <strong>
                          {item.description || item.category}
                        </strong>

                        <small>
                          {item.category} ·{" "}
                          {item.transaction_date
                            ? new Date(item.transaction_date).toLocaleDateString(
                                "en-IN",
                                { timeZone: "UTC" }
                              )
                            : ""}
                        </small>
                      </div>

                      <strong
                        className={
                          item.type === "income" ? "positive" : "negative"
                        }
                      >
                        {item.type === "income" ? "+" : "−"}
                        {formatCurrency(Number(item.amount))}
                      </strong>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features" id="features">

          <div className="section-heading">
            <span className="eyebrow">
              BUILT FOR YOUR FINANCIAL GOALS
            </span>

            <h2>Everything you need to spend smarter.</h2>

            <p>
              Simple tools that make managing money easier.
            </p>
          </div>

          <div className="feature-grid">

            <article className="feature-card">
              <div className="feature-icon blue">↗</div>
              <h3>Track Your Money</h3>
              <p>
                Record income and expenses to see where your money goes.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon green">◎</div>
              <h3>Set Smart Budgets</h3>
              <p>
                Set monthly spending limits and monitor your progress.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon purple">▥</div>
              <h3>Visual Reports</h3>
              <p>
                Understand spending patterns with clear financial insights.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon yellow">✓</div>
              <h3>Private by Design</h3>
              <p>
                Keep your financial records protected with secure accounts.
              </p>
            </article>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section" id="how-it-works">

          <span className="eyebrow">
            GET STARTED IN MINUTES
          </span>

          <h2>Three steps to financial clarity.</h2>

          <div className="steps">

            <div>
              <b>01</b>
              <h3>Create your account</h3>
              <p>Set up your personal workspace.</p>
            </div>

            <div>
              <b>02</b>
              <h3>Record transactions</h3>
              <p>Add income and expenses as they happen.</p>
            </div>

            <div>
              <b>03</b>
              <h3>Track your progress</h3>
              <p>Review budgets and understand your spending.</p>
            </div>

          </div>
        </section>

        {/* CTA SECTION */}
        <section className="cta-section" id="signup">

          <h2>Your money deserves a smarter plan.</h2>

          <p>
            Start building better money habits with SpendWise.
          </p>

          <a href="#transactions" className="primary-btn">
            Get Started Free →
          </a>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">

        <a href="#home" className="logo">
          <span className="logo-icon">S</span>
          SpendWise
        </a>

        <p>Make every rupee count.</p>

        <span>
          © 2026 SpendWise. Personal finance, made simpler.
        </span>

      </footer>

    </div>
  );
}

export default App;
