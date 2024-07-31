import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is set up correctly
import { GetCrossChainSwapQuoteReponse } from "../../src/types/api";
import { formatUnits } from "ethers";

const SwapForm: React.FC = () => {
  const [fromTokenAddress, setFromTokenAddress] = useState("");
  const [fromChainId, setFromChainId] = useState("");
  const [toTokenAddress, setToTokenAddress] = useState("");
  const [toChainId, setToChainId] = useState("");
  const [fromAmountWei, setFromAmountWei] = useState("");
  const [quote, setQuote] = useState<GetCrossChainSwapQuoteReponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<
        any,
        AxiosResponse<GetCrossChainSwapQuoteReponse>
      >("http://localhost:5001/api/swap", {
        fromTokenAddress,
        fromChainId,
        toTokenAddress,
        toChainId,
        fromAmountWei,
      });

      setQuote(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching swap quote:", error);
      setError("Failed to fetch swap quote. Please try again.");
      setLoading(false);
    }
  };

  const useExampleValues = () => {
    setFromTokenAddress("0x0000000000000000000000000000000000000000");
    setFromChainId("1");
    setToTokenAddress("0x0000000000000000000000000000000000000000");
    setToChainId("137");
    setFromAmountWei("1000000000000000000"); // 1 ETH in Wei
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">From Token Address</label>
            <input
              type="text"
              value={fromTokenAddress}
              onChange={(e) => setFromTokenAddress(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <small className="text-gray-500">
              Use 0x0000000000000000000000000000000000000000 for native tokens
            </small>
          </div>
          <div>
            <label className="block text-gray-700">From Chain ID</label>
            <input
              type="text"
              value={fromChainId}
              onChange={(e) => setFromChainId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <small className="text-gray-500">e.g., 1 for Ethereum</small>
          </div>
          <div>
            <label className="block text-gray-700">To Token Address</label>
            <input
              type="text"
              value={toTokenAddress}
              onChange={(e) => setToTokenAddress(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <small className="text-gray-500">
              Use 0x0000000000000000000000000000000000000000 for native tokens
            </small>
          </div>
          <div>
            <label className="block text-gray-700">To Chain ID</label>
            <input
              type="text"
              value={toChainId}
              onChange={(e) => setToChainId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <small className="text-gray-500">e.g., 137 for Polygon</small>
          </div>
          <div>
            <label className="block text-gray-700">From Amount (Wei)</label>
            <input
              type="text"
              value={fromAmountWei}
              onChange={(e) => setFromAmountWei(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
            <small className="text-gray-500">
              e.g., 1000000000000000000 for 1 ETH
            </small>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {loading ? "Loading..." : "Get Quote"}
            </button>
            <button
              type="button"
              onClick={useExampleValues}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Use Example Values
            </button>
          </div>
        </form>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {quote && (
        <div className="max-w-3xl mt-3 mx-auto p-4 bg-white shadow-md rounded">
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-bold mb-4">Swap Quote</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-gray-700">From Token</h3>
                <p>Amount (Wei): {fromAmountWei}</p>
                <p>
                  Amount:{" "}
                  <b>
                    {formatUnits(
                      fromAmountWei,
                      quote.fromToken.decimals
                    ).toLocaleString()}{" "}
                    {quote.fromToken.name}
                  </b>
                </p>
                <p>
                  Equivalent USD: {parseFloat(quote.toAmountUSD) + quote.fees} $
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-700">To Token</h3>
                <p>Amount (Wei): {quote.toAmountWei}</p>
                <p>
                  Amount:{" "}
                  <b>
                    {formatUnits(
                      quote.toAmountWei,
                      quote.toToken.decimals
                    ).toLocaleString()}{" "}
                    {quote.toToken.name}
                  </b>
                </p>
                <p>Equivalent USD: {quote.toAmountUSD} $</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-gray-700">General Info</h3>
              <p className="mb-3">
                Estimated Time:{" "}
                {quote.estimatedTime ? quote.estimatedTime : "5+"} minutes
              </p>
              <p>
                Bridge Fees: <b>{quote.fees} $</b>
              </p>

              <p>
                Estimated gas fee: <b>{quote.gasUSD} $</b>
              </p>
              <>
                Total cost:{" "}
                <b>{(quote.fees + parseFloat(quote.gasUSD)).toFixed(2)} $</b>
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SwapForm;
