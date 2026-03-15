import React, { useState, useEffect } from "react";
import './App.css';

const QUOTES = [
  "🌙 The best charity is given in Ramadan.",
  "✨ Small deeds in Ramadan shine bright!",
  "💫 Spread kindness, it's blessed in this holy month.",
  "🕌 Ramadan is about reflection and giving.",
  "💖 Giving is the heart of Ramadan."
];

function App() {
  const [donations, setDonations] = useState(
    JSON.parse(localStorage.getItem("donations")) || []
  );
  const [amount, setAmount] = useState("");
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [quote, setQuote] = useState("");
  const [confetti, setConfetti] = useState(false);

  const milestones = [50, 100, 200];

  useEffect(() => {
    localStorage.setItem("donations", JSON.stringify(donations));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    checkMilestones();
  }, [donations, darkMode]);

  useEffect(() => {
    pickRandomQuote();
    const interval = setInterval(pickRandomQuote, 5000);
    return () => clearInterval(interval);
  }, []);

  const addDonation = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const newDonation = { id: Date.now(), amount: parseFloat(amount), date: new Date() };
    setDonations([...donations, newDonation]);
    setAmount("");
  };

  const deleteDonation = (id) => {
    setDonations(donations.filter(d => d.id !== id));
  };

  const clearDonations = () => setDonations([]);

  const totalAmount = donations.reduce((acc, d) => acc + d.amount, 0);
  const donationCount = donations.length;
  const topDonation = donations.length ? Math.max(...donations.map(d => d.amount)) : 0;

  const pickRandomQuote = () => {
    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(random);
  };

  const checkMilestones = () => {
    milestones.forEach(m => {
      if (totalAmount >= m && totalAmount - parseFloat(amount || 0) < m) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }
    });
  };

  const exportPDF = () => {
    const printContent = document.getElementById("donation-print");
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`
      <html>
        <head>
          <title>Donations Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #7F00FF; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #FFD93D; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <div className={`${darkMode ? "bg-[#1F1F2E] text-[#E0E0FF]" : "bg-linear-to-b from-purple-700 via-pink-400 to-yellow-300 text-purple-900"} min-h-screen p-4 md:p-6 lg:p-8 flex flex-col items-center transition-colors duration-500 relative`}>

      {confetti && <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-confetti z-10"></div>}

      <header className="w-full max-w-lg flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0 text-center sm:text-left">🌙 Ramadan Charity Tracker</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded transition-colors duration-300 bg-linear-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold"
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </header>

      <div className={`${darkMode ? "bg-[#2B2B40]" : "bg-white"} rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-lg transition-colors duration-500 relative z-0`}>

        <p className="mb-4 font-medium italic text-center text-sm sm:text-base">{quote}</p>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter donation amount"
            className={`${darkMode ? "bg-[#3A3A5A] text-white border-[#555]" : "bg-white text-gray-900 border-gray-300"} flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-300`}
          />
          <button
            onClick={addDonation}
            className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded transition-all duration-300 font-semibold"
          >
            Add
          </button>
        </div>

        <div className="mb-4 text-center">
          <h2 className="text-lg sm:text-xl font-semibold">Total Donations</h2>
          <p className={`${darkMode ? "text-purple-400" : "text-purple-700"} text-xl sm:text-2xl font-bold`}>
            ${totalAmount.toFixed(2)}
          </p>
          <p className="text-sm sm:text-base italic">{donationCount} donations • Top: ${topDonation.toFixed(2)}</p>
          <div className={`${darkMode ? "bg-[#3A3A5A]" : "bg-gray-300"} h-3 sm:h-4 w-full rounded-full mt-2`}>
            <div
              className="h-3 sm:h-4 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalAmount / milestones[milestones.length - 1]) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Milestones Achieved</h3>
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {milestones.map((m) => (
              <div
                key={m}
                className={`px-3 py-1 rounded-full text-white text-sm sm:text-base font-semibold ${totalAmount >= m ? "bg-green-500 animate-pulse" : "bg-gray-400 dark:bg-gray-500"} transition-all duration-300`}
                title={`Milestone $${m}`}
              >
                ${m}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Donation History</h3>
          <ul className="max-h-56 sm:max-h-44 overflow-y-auto">
            {donations.map((d) => {
              const today = new Date();
              const isToday = new Date(d.date).toDateString() === today.toDateString();
              return (
                <li
                  key={d.id}
                  className={`flex flex-col sm:flex-row justify-between py-1 border-b dark:border-gray-700 transition-colors duration-300 px-2 sm:px-0 ${darkMode ? "hover:bg-[#3A3A5A]" : "hover:bg-purple-100"} ${isToday ? "bg-yellow-100 dark:bg-yellow-600" : ""}`}
                >
                  <span>${d.amount.toFixed(2)} - {new Date(d.date).toLocaleDateString()}</span>
                  <button
                    onClick={() => deleteDonation(d.id)}
                    className="text-red-500 hover:text-red-700 font-semibold mt-1 sm:mt-0"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
          <button
            onClick={exportPDF}
            className="bg-linear-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-4 py-2 rounded font-semibold transition-all duration-300 w-full sm:w-auto"
          >
            Export as PDF
          </button>
          <button
            onClick={clearDonations}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-all duration-300 w-full sm:w-auto"
          >
            Clear All Donations
          </button>
        </div>

        <div id="donation-print" style={{ display: "none" }}>
          <h1>🌙 Ramadan Donations Report</h1>
          {donations.length === 0 ? <p>No donations yet.</p> :
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Amount ($)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, index) => (
                  <tr key={d.id}>
                    <td>{index + 1}</td>
                    <td>{d.amount.toFixed(2)}</td>
                    <td>{new Date(d.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" style={{ fontWeight: "bold" }}>Total</td>
                  <td style={{ fontWeight: "bold" }}>${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          }
        </div>

      </div>

      <footer className="mt-6 font-medium text-center text-sm sm:text-base">
        🌙 May your Ramadan be blessed! ✨
      </footer>
    </div>
  );
}

export default App;