import { z } from "zod";

export const orderItemSchema = z.object({
  toolId: z.string().min(1, "Tool ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(99, "Maximum 99 per item"),
});

export const customerInfoSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name too long"),
  email: z.string().trim().email("Please enter a valid email address").max(254, "Email address too long"),
  phone: z
    .string()
    .trim()
    .regex(/^\+\d{1,4} \d+$/, "Please enter a valid phone number")
    .refine((phone) => {
      const [countryCode, localNumber = ""] = phone.split(" ");
      return countryCode === "+965"
        ? /^\d{8}$/.test(localNumber)
        : /^\d{6,12}$/.test(localNumber);
    }, "Please enter a valid phone number"),
  deliveryNotes: z.string().trim().max(500, "Notes too long").optional(),
});

export const createOrderSchema = z.object({
  idempotencyKey: z.string().uuid("Invalid order submission key"),
  customer: customerInfoSchema,
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
  _gotcha: z.string().max(0, "Bot detected").optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
