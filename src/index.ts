import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getCrossChainSwapQuote } from "./routes";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());

app.post("/api/swap", getCrossChainSwapQuote);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
