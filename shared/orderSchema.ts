import { z } from "zod";

export const orderItemSchema = z.object({
  toolId: z.string().min(1, "Tool ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(99, "Maximum 99 per item"),
});

export const customerInfoSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name too long"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number too long")
    .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/, "Invalid phone number format"),
  deliveryNotes: z.string().trim().max(500, "Notes too long").optional(),
});

export const createOrderSchema = z.object({
  customer: customerInfoSchema,
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
  _gotcha: z.string().max(0, "Bot detected").optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
