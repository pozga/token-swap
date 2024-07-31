import React from "react";
import SwapForm from "./SwapForm";
import "./index.css"; // Import the Tailwind CSS file

function App() {
  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="App-header mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Token Swap</h1>
      </header>
      <main className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <SwapForm />
      </main>
    </div>
  );
}

export default App;
