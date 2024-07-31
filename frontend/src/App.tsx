import React from "react";
import SwapForm from "./SwapForm";
import "./index.css"; // Import the Tailwind CSS file
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

export const thirdwebClient = createThirdwebClient({
  clientId: "eb782e7407d6c7df1f84b9b699544c90",
});

function App() {
  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="App-header mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Token Swap</h1>
      </header>
      <main className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <ThirdwebProvider>
          <div className="flex items-center justify-center">
            <ConnectButton
              client={thirdwebClient}
              theme={"light"}
              connectModal={{ size: "wide" }}
            />
          </div>
          <SwapForm />
        </ThirdwebProvider>
      </main>
    </div>
  );
}

export default App;
