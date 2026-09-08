import type { IncomingMessage, ServerResponse } from "node:http";

import { getClientIp, readJsonBody, RequestBodyTooLargeError } from "../../server/processEnquiry.js";
import { processOrder } from "../../server/processOrder.js";
import { checkServerRateLimit } from "../../server/serverRateLimit.js";

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (value: unknown) => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method Not Allowed");
    return;
  }

  const rateLimit = checkServerRateLimit(`order:${getClientIp(req)}`, 10);
  if (rateLimit.limited) {
    res.status(429).setHeader("Retry-After", rateLimit.retryAfterSeconds).json({ message: "Too many order requests. Please try again later." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const result = await processOrder(body, getClientIp(req));

    if (!result.ok) {
      res.status(result.status).json({ message: result.message });
      return;
    }

    res.status(200).json(result.receipt);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      res.status(413).json({ message: "Request body is too large" });
      return;
    }
    res.status(400).json({ message: "Invalid request body" });
  }
}