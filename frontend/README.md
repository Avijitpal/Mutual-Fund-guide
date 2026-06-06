<div align="center">
  <h1>📊 OptimaFunds</h1>
  <p><em>Your Intelligent Mutual Fund Companion</em></p>
  
  <!-- 🌐 PUT YOUR LIVE LINK HERE 🌐 -->
  <h3>
    <strong>🔗 <a href="#">[INSERT LIVE DEMO LINK HERE]</a></strong>
  </h3>
</div>

Welcome to **OptimaFunds**, a full-stack mutual fund analysis and portfolio management platform. This application empowers users to discover, compare, and track mutual fund investments with precision, guided by AI-powered insights! 🚀

## ✨ Key Features

*   **🔍 Explore Dashboard:** Browse top-performing mutual funds across various categories (Equity, Debt, Hybrid).
*   **📈 Interactive Analytics:** View detailed historical NAV charts powered by real-time data and Recharts.
*   **⚖️ Fund Comparison:** Compare multiple funds side-by-side to make data-driven investment choices.
*   **💸 Fee Impact Analyzer:** Understand the long-term impact of expense ratios on your returns.
*   **🧮 SIP Calculator:** Plan your financial goals with an intuitive Systematic Investment Plan calculator.
*   **💼 Portfolio Tracker:** Securely log in to manage, track, and bookmark your personal investment watchlist.
*   **🤖 AI Advisor & Chat:** Get instant answers to your financial queries and personalized investment advice.
*   **🔐 Secure Authentication:** Robust JWT-based authentication system to keep your portfolio data safe.

## 🛠️ Technology Stack

**🎨 Frontend:** React 18, Vite, React Router DOM, Tailwind CSS, Recharts  
**⚙️ Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth, mfapi.in Integration

## 🚀 Getting Started

### 1. Clone & Install Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Setup Backend
```bash
cd backend
npm install
# Set up your .env file with PORT, MONGO_URI, JWT_SECRET, and JWT_EXPIRE
npm start
```

### 3. Seed the Database (Optional but recommended)
Trigger the seed route `POST /api/funds/seed` (e.g., via Postman) to populate your database with real mutual fund data from the API concurrently.

---
<div align="center">
  <i>Built with ❤️ for smarter investing.</i>
</div>
