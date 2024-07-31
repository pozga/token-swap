import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import "tailwindcss/tailwind.css";
import { GetCrossChainSwapQuoteReponse } from "../../src/types/api";
import { formatUnits } from "ethers";
import { useActiveWallet } from "thirdweb/react";

const SwapForm: React.FC = () => {
  const [fromTokenAddress, setFromTokenAddress] = useState("");
  const [fromChainId, setFromChainId] = useState("");
  const [toTokenAddress, setToTokenAddress] = useState("");
  const [toChainId, setToChainId] = useState("");
  const wallet = useActiveWallet();
  const [fromAmountWei, setFromAmountWei] = useState("");
  const [quote, setQuote] = useState<GetCrossChainSwapQuoteReponse | null>(
    null
  );
  // const { mutate: sendBatch, data: transactionResult } =
  //   useSendBatchTransaction();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = async (transactionRequest: any[]) => {
    if (!wallet) {
      alert("Please connect your wallet to execute the transaction.");
      return;
    }

    // Has compile error
    // const preparedTransactions = transactionRequest.map((transaction: any) => {
    //   return prepareTransaction({
    //     ...transaction,
    //     client: thirdwebClient,
    //     chain: fromChainId,
    //   });
    // });

    try {
      // const txResponse = await sendBatch(preparedTransactions);
      // console.log("Transaction sent:", txResponse);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const response = await axios.post<
        any,
        AxiosResponse<GetCrossChainSwapQuoteReponse>
      >("http://localhost:5001/api/swap", {
        userAddress: wallet?.getAccount()?.address,
        fromTokenAddress,
        fromChainId,
        toTokenAddress,
        toChainId,
        fromAmountWei,
      });

      setQuote(response.data);
      setTimeout(() => {
        document.getElementById("quote")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
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

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    setQuote(null);
  };

  if (!wallet) {
    return (
      <div className="flex  justify-center text-grey-500 mt-5">
        Please connect your wallet to use the swap functionality.
      </div>
    );
  }

  return (
    <>
      <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">From Token Address</label>
            <input
              type="text"
              value={fromTokenAddress}
              onChange={(e) =>
                handleInputChange(setFromTokenAddress, e.target.value)
              }
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
              onChange={(e) =>
                handleInputChange(setFromChainId, e.target.value)
              }
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
              onChange={(e) =>
                handleInputChange(setToTokenAddress, e.target.value)
              }
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
              onChange={(e) => handleInputChange(setToChainId, e.target.value)}
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
              onChange={(e) =>
                handleInputChange(setFromAmountWei, e.target.value)
              }
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
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {loading ? "Loading..." : "Get Quote"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={useExampleValues}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Use Example Values
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      {quote && (
        <div
          id="quote"
          className="max-w-3xl mt-3 mx-auto p-4 bg-white shadow-md rounded"
        >
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
                Service Fees: <b>{quote.fees} $</b>
              </p>

              <p>
                Estimated gas fee: <b>{quote.gasUSD} $</b>
              </p>
              <>
                Total cost:{" "}
                <b>{(quote.fees + parseFloat(quote.gasUSD)).toFixed(2)} $</b>
              </>
            </div>
            <div>
              <div className="mt-4">
                <b>Transactions to start the exchange (approval, send):</b>{" "}
                <pre id="json" style={{ overflowY: "scroll" }}>
                  {JSON.stringify(quote.transactionRequest, null, 2)}
                </pre>
              </div>
              <div className="mt-4">
                <button
                  disabled
                  onClick={() => executeTransaction(quote.transactionRequest)}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Execute Transaction (TODO)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SwapForm;
