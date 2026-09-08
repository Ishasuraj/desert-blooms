import { enquirySchema } from "../shared/enquirySchema.js";

import { sendEnquiryEmail } from "./mail.js";

export type EnquiryResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

export async function processEnquiry(
  body: unknown,
  clientIp: string,
): Promise<EnquiryResult> {
  if (
    typeof body === "object" &&
    body !== null &&
    "_gotcha" in body &&
    typeof (body as { _gotcha?: unknown })._gotcha === "string" &&
    (body as { _gotcha: string })._gotcha.length > 0
  ) {
    return { ok: true };
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message;
    return {
      ok: false,
      status: 400,
      message: firstIssue ?? "Invalid enquiry submission",
    };
  }

  const enquiry = parsed.data;
  const { _gotcha: _ignored, ...payload } = enquiry;

  try {
    await sendEnquiryEmail(payload, clientIp);
    return { ok: true };
  } catch (error) {
    console.error("Failed to send enquiry email:", error);
    return {
      ok: false,
      status: 503,
      message: "We could not send your enquiry right now. Please try again shortly.",
    };
  }
}

export function readJsonBody(
  req: NodeJS.ReadableStream & {
    body?: unknown;
    on(event: "data", listener: (chunk: Buffer | string) => void): void;
    on(event: "end", listener: () => void): void;
    on(event: "error", listener: (error: Error) => void): void;
  },
): Promise<unknown> {
  if (req.body && typeof req.body === "object") {
    return Promise.resolve(req.body);
  }

  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(body ? (JSON.parse(body) as unknown) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

export function getClientIp(
  req: {
    headers: Record<string, string | string[] | undefined>;
    socket?: { remoteAddress?: string | null };
  },
) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return req.socket?.remoteAddress || "unknown";
}
