import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import { getClientIp, processEnquiry } from "./processEnquiry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enquiryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many enquiries from this address. Please try again later.",
  },
});

const orderRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many order requests from this address. Please try again in a few minutes.",
  },
});

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "16kb" }));

  app.post("/api/enquiry", enquiryRateLimit, async (req, res) => {
    const result = await processEnquiry(req.body, getClientIp(req));

    if (!result.ok) {
      res.status(result.status).json({ message: result.message });
      return;
    }

    res.status(200).json({ message: "Enquiry sent successfully" });
  });

  app.post("/api/order/create", orderRateLimit, async (req, res) => {
    const { processOrder } = await import("./processOrder.js");
    const result = await processOrder(req.body, getClientIp(req));

    if (!result.ok) {
      res.status(result.status).json({ message: result.message });
      return;
    }

    res.status(200).json(result.receipt);
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
